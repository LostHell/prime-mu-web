import {
  isChunkName,
  isLauncherSystem,
  launcherFileParts,
  patchFileParts,
} from "./release-paths";

const CHUNK = "a".repeat(64);

test("names a chunk only by a lowercase SHA-256 in hex", () => {
  expect(isChunkName(CHUNK)).toBe(true);
  expect(isChunkName("A".repeat(64))).toBe(false);
  expect(isChunkName("a".repeat(63))).toBe(false);
  expect(isChunkName(`${"a".repeat(63)}/`)).toBe(false);
});

test("serves only the manifest, its signature and the chunks under patches", () => {
  expect(patchFileParts(["manifest.json"])).toEqual([
    "patches",
    "manifest.json",
  ]);
  expect(patchFileParts(["manifest.sig"])).toEqual(["patches", "manifest.sig"]);
  expect(patchFileParts(["chunks", CHUNK])).toEqual([
    "patches",
    "chunks",
    CHUNK,
  ]);
  for (const segments of [
    [],
    ["chunks"],
    ["chunks", "..", "manifest.json"],
    ["chunks", "../../.env"],
    ["..", "manifest.json"],
    ["state.json"],
    ["chunks", CHUNK, "x"],
  ]) {
    expect(patchFileParts(segments)).toBeNull();
  }
});

test("knows the two launchers and their files", () => {
  expect(isLauncherSystem("windows")).toBe(true);
  expect(isLauncherSystem("macos")).toBe(true);
  expect(isLauncherSystem("linux")).toBe(false);
  expect(isLauncherSystem("toString")).toBe(false);
  expect(launcherFileParts("windows")).toEqual([
    "launcher",
    "windows",
    "launcher.exe",
  ]);
  expect(launcherFileParts("macos")).toEqual(["launcher", "macos", "MU.zip"]);
});
