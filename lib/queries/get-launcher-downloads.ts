import "server-only";

import { installBytes } from "@/lib/launcher/manifest";
import {
  readPublishedManifest,
  releaseFileSize,
} from "@/lib/launcher/release-files";
import { launcherFileParts } from "@/lib/launcher/release-paths";
import type { LauncherDownload } from "@/lib/types/launcher";

// The game files each launcher installs: the Windows launcher's are x64's (ARM64's are as big).
const INSTALL_PLATFORM = { windows: "windows-x64", macos: "macos" } as const;

/** The published launchers and what they install, from the release folder. */
export const getLauncherDownloads = async (): Promise<LauncherDownload[]> => {
  const manifest = await readPublishedManifest();
  const downloads: LauncherDownload[] = [];

  for (const system of ["windows", "macos"] as const) {
    const parts = launcherFileParts(system);
    const launcherBytes = await releaseFileSize(parts);
    downloads.push({
      system,
      href: launcherBytes === null ? null : `/downloads/${parts.join("/")}`,
      launcherBytes,
      installBytes: manifest
        ? installBytes(manifest, INSTALL_PLATFORM[system])
        : null,
    });
  }
  return downloads;
};
