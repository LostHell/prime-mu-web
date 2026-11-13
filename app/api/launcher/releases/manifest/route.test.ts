/** @jest-environment node */
import {
  makeChunk,
  makePublisher,
  sha256Hex,
  useReleaseDir,
} from "@/lib/test-utils/launcher-release";
import { storeChunk } from "@/lib/launcher/release-store";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PUT as putLauncher } from "../launcher/[system]/route";
import { PUT } from "./route";

let release: Awaited<ReturnType<typeof useReleaseDir>>;
const publisher = makePublisher();

beforeEach(async () => {
  release = await useReleaseDir();
  process.env.LAUNCHER_UPLOAD_TOKEN = "upload-secret";
  process.env.LAUNCHER_PUBLIC_KEY = publisher.publicKeyHex;
});

afterEach(async () => {
  delete process.env.LAUNCHER_UPLOAD_TOKEN;
  delete process.env.LAUNCHER_PUBLIC_KEY;
  await release.remove();
});

const launcherBytes = Buffer.from("the launcher program");
const launcherChunk = makeChunk(launcherBytes.toString());
const manifest = Buffer.from(
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
          { sha256: launcherChunk.name, size: launcherBytes.length, packed: 1 },
        ],
      },
    },
    files: [],
  }),
);

const publish = (signature: string) =>
  PUT(
    new Request("http://site/api/launcher/releases/manifest", {
      method: "PUT",
      headers: { authorization: "Bearer upload-secret" },
      body: JSON.stringify({
        manifest: manifest.toString("base64"),
        signature,
      }),
    }),
  );

const uploadLauncher = (system: string, body: Uint8Array) =>
  putLauncher(
    new Request(`http://site/api/launcher/releases/launcher/${system}`, {
      method: "PUT",
      headers: { authorization: "Bearer upload-secret" },
      body: new Uint8Array(body),
    }),
    { params: Promise.resolve({ system }) },
  );

test("publishes the signed manifest once its chunks are up, then the launcher for the downloads page", async () => {
  expect((await publish(publisher.sign(manifest))).status).toBe(409);

  await storeChunk(launcherChunk.name, launcherChunk.packed);
  expect((await publish(makePublisher().sign(manifest))).status).toBe(400);
  expect((await publish(publisher.sign(manifest))).status).toBe(200);
  expect(
    await readFile(path.join(release.dir, "patches", "manifest.json")),
  ).toEqual(manifest);

  expect((await uploadLauncher("windows", Buffer.from("other"))).status).toBe(
    409,
  );
  expect((await uploadLauncher("linux", launcherBytes)).status).toBe(404);
  expect((await uploadLauncher("windows", launcherBytes)).status).toBe(200);
  expect(
    await readFile(
      path.join(release.dir, "launcher", "windows", "launcher.exe"),
    ),
  ).toEqual(launcherBytes);
});

test("refuses a manifest without the publisher's key on the site", async () => {
  delete process.env.LAUNCHER_PUBLIC_KEY;
  expect((await publish(publisher.sign(manifest))).status).toBe(503);
});
