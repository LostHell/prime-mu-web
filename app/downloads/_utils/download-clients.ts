import { VERSION } from "@/constants/server";
import type { LauncherDownload } from "@/lib/types/launcher";
import { formatMegabytes } from "@/lib/utils/numbers";
import type { DownloadClient } from "../_types/clients";

const SYSTEM_NAMES = { windows: "Windows", macos: "macOS" } as const;

/** The downloads page's cards from the published launchers. */
export const toDownloadClients = (
  downloads: readonly LauncherDownload[],
): DownloadClient[] =>
  downloads.map((download) => ({
    name: SYSTEM_NAMES[download.system],
    version: VERSION,
    size:
      download.launcherBytes === null
        ? null
        : formatMegabytes(download.launcherBytes),
    installed:
      download.installBytes === null
        ? null
        : `About ${formatMegabytes(download.installBytes)}`,
    href: download.href,
  }));
