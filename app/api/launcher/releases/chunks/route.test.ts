/** @jest-environment node */
import { makeChunk, useReleaseDir } from "@/lib/test-utils/launcher-release";
import { PUT } from "./[name]/route";
import { POST } from "./route";

let release: Awaited<ReturnType<typeof useReleaseDir>>;

beforeEach(async () => {
  release = await useReleaseDir();
  process.env.LAUNCHER_UPLOAD_TOKEN = "upload-secret";
});

afterEach(async () => {
  delete process.env.LAUNCHER_UPLOAD_TOKEN;
  await release.remove();
});

const chunk = makeChunk("Data/Interface/Skill.ozj");

const ask = (chunks: string[], token = "upload-secret") =>
  POST(
    new Request("http://site/api/launcher/releases/chunks", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ chunks }),
    }),
  );

const upload = (name: string, body: Uint8Array, token = "upload-secret") =>
  PUT(
    new Request(`http://site/api/launcher/releases/chunks/${name}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
      body: new Uint8Array(body),
    }),
    { params: Promise.resolve({ name }) },
  );

test("tells the publisher which chunks are missing and takes them", async () => {
  expect(await (await ask([chunk.name])).json()).toEqual({
    missing: [chunk.name],
  });

  const stored = await upload(chunk.name, chunk.packed);
  expect(stored.status).toBe(200);
  expect(await (await ask([chunk.name])).json()).toEqual({ missing: [] });

  expect((await upload(makeChunk("other").name, chunk.packed)).status).toBe(
    400,
  );
  expect((await ask(["../x"])).status).toBe(400);
});

test("is closed without the right token, and hidden without a token on the site", async () => {
  expect((await ask([chunk.name], "wrong")).status).toBe(401);
  expect((await upload(chunk.name, chunk.packed, "wrong")).status).toBe(401);

  delete process.env.LAUNCHER_UPLOAD_TOKEN;
  expect((await ask([chunk.name])).status).toBe(404);
  expect((await upload(chunk.name, chunk.packed)).status).toBe(404);
});
