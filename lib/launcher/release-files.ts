import "server-only";

import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { type Manifest, parseManifest } from "./manifest";
import { MANIFEST_FILE } from "./release-paths";

/** Where the launcher's release lives (a Docker volume in production); null when it is not set up. */
export const getReleaseDir = () =>
  process.env.LAUNCHER_FILES_DIR?.trim() || null;

export type ReleaseFile = {
  body: ReadableStream<Uint8Array>;
  size: number;
};

/** A file of the release (path parts from `release-paths.ts`), streamed; null when it is not there. */
export const openReleaseFile = async (
  parts: readonly string[],
): Promise<ReleaseFile | null> => {
  const dir = getReleaseDir();
  if (!dir) return null;

  const file = path.join(dir, ...parts);
  try {
    const info = await stat(file);
    if (!info.isFile()) return null;
    return {
      body: Readable.toWeb(
        createReadStream(file),
      ) as ReadableStream<Uint8Array>,
      size: info.size,
    };
  } catch {
    return null;
  }
};

/** The release's manifest as published; null when there is none (or it is not one). */
export const readPublishedManifest = async (): Promise<Manifest | null> => {
  const dir = getReleaseDir();
  if (!dir) return null;

  try {
    return parseManifest(
      await readFile(path.join(dir, "patches", MANIFEST_FILE), "utf8"),
    );
  } catch {
    return null;
  }
};

/** The size of a release file in bytes; null when it is not there. */
export const releaseFileSize = async (parts: readonly string[]) => {
  const dir = getReleaseDir();
  if (!dir) return null;

  try {
    const info = await stat(path.join(dir, ...parts));
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
};
