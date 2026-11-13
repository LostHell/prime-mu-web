import { installBytes, parseManifest, referencedChunks } from "./manifest";

const sha = (c: string) => c.repeat(64);

const chunk = (c: string, size: number) => ({
  sha256: sha(c),
  size,
  packed: size - 1,
});

const manifest = {
  format: 1,
  version: "2026.11.13-1108",
  launcher: {
    windows: {
      version: "2026.11.13-1108",
      file: "launcher.exe",
      size: 10,
      sha256: sha("1"),
      chunks: [chunk("1", 10)],
    },
  },
  files: [
    {
      path: "Data/a.bmd",
      size: 100,
      sha256: sha("a"),
      chunks: [chunk("a", 100)],
    },
    {
      path: "main.exe",
      platform: "windows-x64",
      size: 30,
      sha256: sha("b"),
      chunks: [chunk("b", 20), chunk("c", 10)],
    },
    {
      path: "main.app/Contents/MacOS/main",
      platform: "macos",
      size: 40,
      sha256: sha("d"),
      chunks: [chunk("d", 40)],
      executable: true,
    },
  ],
  somethingNew: true,
};

test("reads a manifest and ignores fields it does not know", () => {
  const parsed = parseManifest(JSON.stringify(manifest));
  expect(parsed?.version).toBe("2026.11.13-1108");
  expect(parsed?.files).toHaveLength(3);
  expect(parsed?.launcher?.windows.file).toBe("launcher.exe");
});

test("refuses what is not a format 1 manifest", () => {
  expect(parseManifest("not json")).toBeNull();
  expect(parseManifest(JSON.stringify({ ...manifest, format: 2 }))).toBeNull();
  expect(
    parseManifest(
      JSON.stringify({
        ...manifest,
        files: [{ ...manifest.files[0], sha256: "../x" }],
      }),
    ),
  ).toBeNull();
});

test("lists every chunk of the files and the launchers once", () => {
  const parsed = parseManifest(JSON.stringify(manifest));
  expect(parsed && [...referencedChunks(parsed)].sort()).toEqual(
    ["1", "a", "b", "c", "d"].map(sha),
  );
});

test("counts what a system installs: the shared files and its own", () => {
  const parsed = parseManifest(JSON.stringify(manifest));
  expect(parsed && installBytes(parsed, "windows-x64")).toBe(130);
  expect(parsed && installBytes(parsed, "macos")).toBe(140);
  expect(parsed && installBytes(parsed, "windows-arm64")).toBe(100);
});
