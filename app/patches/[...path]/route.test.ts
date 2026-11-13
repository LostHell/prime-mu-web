/** @jest-environment node */
import { makeChunk, useReleaseDir } from "@/lib/test-utils/launcher-release";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GET } from "./route";

let release: Awaited<ReturnType<typeof useReleaseDir>>;

beforeEach(async () => {
  release = await useReleaseDir();
  await mkdir(path.join(release.dir, "patches", "chunks"), { recursive: true });
  await writeFile(
    path.join(release.dir, "patches", "manifest.json"),
    '{"format":1}',
  );
  await writeFile(path.join(release.dir, ".env"), "SECRET=1");
});

afterEach(async () => {
  await release.remove();
});

const get = (segments: string[]) =>
  GET(new Request("http://site/patches"), {
    params: Promise.resolve({ path: segments }),
  });

test("serves a chunk to be cached for good and the manifest never", async () => {
  const chunk = makeChunk("bytes");
  await writeFile(
    path.join(release.dir, "patches", "chunks", chunk.name),
    chunk.packed,
  );

  const chunkResponse = await get(["chunks", chunk.name]);
  expect(chunkResponse.status).toBe(200);
  expect(chunkResponse.headers.get("cache-control")).toContain("immutable");
  expect(Buffer.from(await chunkResponse.arrayBuffer())).toEqual(chunk.packed);

  const manifestResponse = await get(["manifest.json"]);
  expect(manifestResponse.headers.get("content-type")).toBe("application/json");
  expect(manifestResponse.headers.get("cache-control")).toBe("no-cache");
  expect(await manifestResponse.text()).toBe('{"format":1}');
});

test("answers 404 for a missing file and for anything outside the release", async () => {
  expect((await get(["manifest.sig"])).status).toBe(404);
  expect((await get(["chunks", "f".repeat(64)])).status).toBe(404);
  expect((await get(["..", ".env"])).status).toBe(404);
  expect((await get(["chunks", "..", "..", ".env"])).status).toBe(404);
});
