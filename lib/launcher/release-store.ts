import "server-only";

import { createHash, randomBytes } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { zstdDecompressSync } from "node:zlib";
import { parseManifest, referencedChunks } from "./manifest";
import {
  isChunkName,
  launcherFileParts,
  type LauncherSystem,
  MANIFEST_FILE,
  SIGNATURE_FILE,
} from "./release-paths";
import { getReleaseDir } from "./release-files";
import { isManifestSignedBy } from "./signature";

/** A chunk's most unpacked bytes (the game client's MANIFEST_CHUNK_BYTES). */
export const MAX_CHUNK_BYTES = 8 * 1024 * 1024;

export type StoreResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

const refuse = (status: number, message: string): StoreResult => ({
  ok: false,
  status,
  message,
});

const sha256Hex = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");

const exists = async (file: string) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

// Written beside it under a name of its own, then renamed into place: a reader sees the old file or
// the new one, never half of one.
const writeAtomically = async (file: string, bytes: Uint8Array) => {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.upload-${randomBytes(8).toString("hex")}`;
  try {
    await writeFile(temporary, bytes);
    await rename(temporary, file);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
};

const releasePath = (dir: string, ...parts: string[]) =>
  path.join(dir, ...parts);

/** Of `names`, the chunks the release folder does not have yet. */
export const missingChunks = async (names: readonly string[]) => {
  const dir = getReleaseDir();
  if (!dir) return [...names];

  const missing: string[] = [];
  for (const name of new Set(names)) {
    if (!(await exists(releasePath(dir, "patches", "chunks", name)))) {
      missing.push(name);
    }
  }
  return missing;
};

/**
 * Keeps a chunk (zstd-packed bytes) under its name, when it unpacks to at most MAX_CHUNK_BYTES
 * whose SHA-256 is that name. A chunk already there is left as it is: a name never changes content.
 */
export const storeChunk = async (
  name: string,
  packed: Uint8Array,
): Promise<StoreResult> => {
  const dir = getReleaseDir();
  if (!dir) return refuse(503, "The release folder is not set up.");
  if (!isChunkName(name)) return refuse(400, "Not a chunk name.");

  let unpacked: Buffer;
  try {
    unpacked = zstdDecompressSync(packed, { maxOutputLength: MAX_CHUNK_BYTES });
  } catch {
    return refuse(400, "Not a zstd chunk of at most 8 MB.");
  }
  if (sha256Hex(unpacked) !== name) {
    return refuse(400, "The chunk's content does not match its name.");
  }

  const file = releasePath(dir, "patches", "chunks", name);
  if (!(await exists(file))) await writeAtomically(file, packed);
  return { ok: true };
};

/**
 * Makes `manifest` (its exact bytes) with `signatureText` the published release, when the
 * publisher's key signed it and every chunk it names is there. The signature goes first, the
 * manifest last: a launcher that reads between the two finds them not matching and tries again.
 */
export const storeManifest = async (
  manifest: Uint8Array,
  signatureText: string,
  publicKeyHex: string,
): Promise<StoreResult> => {
  const dir = getReleaseDir();
  if (!dir) return refuse(503, "The release folder is not set up.");
  if (!isManifestSignedBy(manifest, signatureText, publicKeyHex)) {
    return refuse(400, "The manifest is not signed by the publisher's key.");
  }

  const parsed = parseManifest(Buffer.from(manifest).toString("utf8"));
  if (!parsed) return refuse(400, "Not a launcher manifest.");

  const missing = await missingChunks([...referencedChunks(parsed)]);
  if (missing.length > 0) {
    return refuse(409, `${missing.length} chunks of the release are missing.`);
  }

  await writeAtomically(
    releasePath(dir, "patches", SIGNATURE_FILE),
    Buffer.from(`${signatureText.trim()}\n`),
  );
  await writeAtomically(releasePath(dir, "patches", MANIFEST_FILE), manifest);
  return { ok: true };
};

/** Puts the launcher of `system` on the downloads page, when it is the published release's. */
export const storeLauncher = async (
  system: LauncherSystem,
  bytes: Uint8Array,
): Promise<StoreResult> => {
  const dir = getReleaseDir();
  if (!dir) return refuse(503, "The release folder is not set up.");

  let manifestText: string;
  try {
    manifestText = await readFile(
      releasePath(dir, "patches", MANIFEST_FILE),
      "utf8",
    );
  } catch {
    return refuse(409, "Publish the release's manifest first.");
  }
  const release = parseManifest(manifestText)?.launcher?.[system];
  if (!release) {
    return refuse(
      409,
      "The published release has no launcher for this system.",
    );
  }
  if (sha256Hex(bytes) !== release.sha256) {
    return refuse(409, "This is not the published release's launcher.");
  }

  await writeAtomically(releasePath(dir, ...launcherFileParts(system)), bytes);
  return { ok: true };
};
