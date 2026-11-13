export type DownloadClient = {
  name: string;
  version: string;
  /** The launcher's size ("5.0 MB"); null when it is not published. */
  size: string | null;
  /** What the launcher installs ("About 380.2 MB"); null without a published release. */
  installed: string | null;
  href: string | null;
};
