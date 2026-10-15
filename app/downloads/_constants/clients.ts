import { VERSION } from "@/constants/server";
import type { DownloadClient } from "../_types/clients";
import { getClientDownloadUrl } from "../_utils/client-download-url";
import {
  MACOS_CLIENT_MB,
  WINDOWS_CLIENT_UNZIPPED_MB,
  WINDOWS_CLIENT_ZIPPED_MB,
} from "./downloads";

export const CLIENTS: DownloadClient[] = [
  {
    name: "Windows",
    version: VERSION,
    size: `${WINDOWS_CLIENT_ZIPPED_MB} MB zipped`,
    installed: `${WINDOWS_CLIENT_UNZIPPED_MB} MB unzipped`,
    href: getClientDownloadUrl(process.env.WINDOWS_CLIENT_URL),
  },
  {
    name: "macOS",
    version: VERSION,
    size: `${MACOS_CLIENT_MB} MB`,
    installed: null,
    href: getClientDownloadUrl(process.env.MACOS_CLIENT_URL),
  },
];
