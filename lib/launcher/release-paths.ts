/**
 * The launcher's release files in LAUNCHER_FILES_DIR, as `publish.cmd` of the game client lays them
 * out:
 *
 *   patches/manifest.json, patches/manifest.sig   the latest release and its signature
 *   patches/chunks/<sha256>                       the zstd chunks, named by their unpacked SHA-256
 *   launcher/<system>/<file>                      the launchers the downloads page gives out
 */

export const LAUNCHER_FILES = {
  windows: "launcher.exe",
  macos: "MU.zip",
} as const;

export type LauncherSystem = keyof typeof LAUNCHER_FILES;

export const MANIFEST_FILE = "manifest.json";
export const SIGNATURE_FILE = "manifest.sig";

export const isLauncherSystem = (value: string): value is LauncherSystem =>
  Object.hasOwn(LAUNCHER_FILES, value);

/** A chunk's name: the SHA-256 of its unpacked bytes, in lowercase hex. */
export const isChunkName = (value: string) => /^[0-9a-f]{64}$/.test(value);

/** A file under `patches/` the launcher may fetch, as path parts; null for anything else. */
export const patchFileParts = (segments: readonly string[]) => {
  if (
    segments.length === 1 &&
    (segments[0] === MANIFEST_FILE || segments[0] === SIGNATURE_FILE)
  ) {
    return ["patches", segments[0]];
  }
  if (segments.length === 2 && segments[0] === "chunks") {
    return isChunkName(segments[1]) ? ["patches", "chunks", segments[1]] : null;
  }
  return null;
};

/** The launcher of `system` as path parts. */
export const launcherFileParts = (system: LauncherSystem) => [
  "launcher",
  system,
  LAUNCHER_FILES[system],
];
