/** What the game's launcher reads from the site (/api/launcher/*). Changing a field breaks launchers already out there. */

export type LauncherServer = {
  name: string;
  online: boolean;
  players: number;
};

export type LauncherStatus = {
  online: number;
  max: number;
  servers: LauncherServer[];
};

/** A system's launcher on the downloads page. */
export type LauncherDownload = {
  system: "windows" | "macos";
  /** The site's path of the launcher; null when it is not published. */
  href: string | null;
  launcherBytes: number | null;
  /** What the launcher installs; null without a published release. */
  installBytes: number | null;
};

export type LauncherNewsItem = {
  /** ISO date, "2026-10-08". */
  date: string;
  title: string;
  author: string;
  /** Its place on the site; the launcher opens only the site's own addresses. */
  url: string;
};
