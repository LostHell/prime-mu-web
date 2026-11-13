/** @jest-environment node */
import {
  makeChunk,
  makePublisher,
  sha256Hex,
  useReleaseDir,
} from "@/lib/test-utils/launcher-release";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { zstdCompressSync } from "node:zlib";
import { readPublishedManifest, releaseFileSize } from "./release-files";
import {
  MAX_CHUNK_BYTES,
  missingChunks,
  storeChunk,
  storeLauncher,
  storeManifest,
} from "./release-store";

let release: Awaited<ReturnType<typeof useReleaseDir>>;

beforeEach(async () => {
  release = await useReleaseDir();
});

afterEach(async () => {
  await release.remove();
});

const launcherBytes = Buffer.from("the launcher program");
const data = makeChunk("Data/Monster/Monster67.bmd");
const launcherChunk = makeChunk(launcherBytes.toString());

const manifestOf = (chunks: string[]) =>
  Buffer.from(
    JSON.stringify({
      format: 1,
      version: "2026.11.13-1108",
      launcher: {
        windows: {
          version: "2026.11.13-1108",
          file: "launcher.exe",
          size: launcherBytes.length,
          sha256: sha256Hex(launcherBytes),
          chunks: [
            {
              sha256: launcherChunk.name,
              size: launcherBytes.length,
              packed: 1,
            },
          ],
        },
      },
      files: [
        {
          path: "Data/Monster/Monster67.bmd",
          size: data.bytes.length,
          sha256: data.name,
          chunks: chunks.map((name) => ({ sha256: name, size: 1, packed: 1 })),
        },
      ],
    }),
  );

test("keeps a chunk under its name only when it unpacks to bytes of that SHA-256", async () => {
  expect(await missingChunks([data.name, data.name])).toEqual([data.name]);

  expect(await storeChunk(data.name, data.packed)).toEqual({ ok: true });
  expect(await missingChunks([data.name])).toEqual([]);
  expect(
    await readFile(path.join(release.dir, "patches", "chunks", data.name)),
  ).toEqual(data.packed);
  // A second upload of it changes nothing.
  expect(await storeChunk(data.name, data.packed)).toEqual({ ok: true });

  const other = makeChunk("something else");
  expect(await storeChunk(data.name, other.packed)).toMatchObject({
    ok: false,
    status: 400,
  });
  expect(await storeChunk("../manifest.json", data.packed)).toMatchObject({
    ok: false,
    status: 400,
  });
  expect(await storeChunk(other.name, Buffer.from("not zstd"))).toMatchObject({
    ok: false,
    status: 400,
  });
  const tooBig = Buffer.alloc(MAX_CHUNK_BYTES + 1);
  expect(
    await storeChunk(sha256Hex(tooBig), zstdCompressSync(tooBig)),
  ).toMatchObject({
    ok: false,
    status: 400,
  });
  // Nothing half written stays behind.
  expect(await readdir(path.join(release.dir, "patches", "chunks"))).toEqual([
    data.name,
  ]);
});

test("publishes a manifest only when the publisher signed it and all its chunks are there", async () => {
  const publisher = makePublisher();
  const manifest = manifestOf([data.name]);

  // Not signed by the publisher.
  expect(
    await storeManifest(
      manifest,
      makePublisher().sign(manifest),
      publisher.publicKeyHex,
    ),
  ).toMatchObject({ ok: false, status: 400 });
  // Signed, but the chunks are not up yet.
  expect(
    await storeManifest(
      manifest,
      publisher.sign(manifest),
      publisher.publicKeyHex,
    ),
  ).toMatchObject({ ok: false, status: 409 });
  expect(await readPublishedManifest()).toBeNull();

  await storeChunk(data.name, data.packed);
  await storeChunk(launcherChunk.name, launcherChunk.packed);
  expect(
    await storeManifest(
      manifest,
      publisher.sign(manifest),
      publisher.publicKeyHex,
    ),
  ).toEqual({ ok: true });

  // Its exact bytes, and the signature beside it.
  expect(
    await readFile(path.join(release.dir, "patches", "manifest.json")),
  ).toEqual(manifest);
  expect(
    (
      await readFile(path.join(release.dir, "patches", "manifest.sig"), "utf8")
    ).trim(),
  ).toBe(publisher.sign(manifest));
  expect((await readPublishedManifest())?.version).toBe("2026.11.13-1108");
});

test("puts up only the published release's launcher", async () => {
  expect(await storeLauncher("windows", launcherBytes)).toMatchObject({
    ok: false,
    status: 409,
  });

  const publisher = makePublisher();
  const manifest = manifestOf([data.name]);
  await storeChunk(data.name, data.packed);
  await storeChunk(launcherChunk.name, launcherChunk.packed);
  await storeManifest(
    manifest,
    publisher.sign(manifest),
    publisher.publicKeyHex,
  );

  expect(
    await storeLauncher("windows", Buffer.from("another program")),
  ).toMatchObject({
    ok: false,
    status: 409,
  });
  expect(await storeLauncher("macos", launcherBytes)).toMatchObject({
    ok: false,
    status: 409,
  });
  expect(await storeLauncher("windows", launcherBytes)).toEqual({ ok: true });
  expect(await releaseFileSize(["launcher", "windows", "launcher.exe"])).toBe(
    launcherBytes.length,
  );
});

test("refuses everything without a release folder", async () => {
  delete process.env.LAUNCHER_FILES_DIR;

  expect(await storeChunk(data.name, data.packed)).toMatchObject({
    ok: false,
    status: 503,
  });
  expect(await readPublishedManifest()).toBeNull();
  expect(await missingChunks([data.name])).toEqual([data.name]);
});
