import { VERSION } from "@/constants/server";
import { toDownloadClients } from "./download-clients";

test("makes a card per system with the launcher's size and what it installs", () => {
  const [windows, macos] = toDownloadClients([
    {
      system: "windows",
      href: "/downloads/launcher/windows/launcher.exe",
      launcherBytes: 5_264_896,
      installBytes: 398_700_000,
    },
    { system: "macos", href: null, launcherBytes: null, installBytes: null },
  ]);

  expect(windows).toEqual({
    name: "Windows",
    version: VERSION,
    size: "5.0 MB",
    installed: "About 380.2 MB",
    href: "/downloads/launcher/windows/launcher.exe",
  });
  expect(macos).toEqual({
    name: "macOS",
    version: VERSION,
    size: null,
    installed: null,
    href: null,
  });
});
