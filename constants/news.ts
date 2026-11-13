/**
 * The news, newest first: on the home page (their text is in app/_components/home-news.tsx) and in
 * the game's launcher (/api/launcher/news), which links each one to `/#news-<id>`.
 */
export const NEWS = [
  {
    id: "marketplace",
    date: "8 Oct 2026",
    dateTime: "2026-10-08",
    title: "Items marketplace is now open!",
  },
  {
    id: "resets",
    date: "1 Oct 2026",
    dateTime: "2026-10-01",
    title: "Resets on the website",
  },
  {
    id: "rankings",
    date: "20 Sep 2026",
    dateTime: "2026-09-20",
    title: "Rankings are live",
  },
] as const;

export type NewsId = (typeof NEWS)[number]["id"];
