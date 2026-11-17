/**
 * The news, newest first. Each item has its own page, /news/<id>; its summary is on the home page, in
 * /news/rss.xml, the sitemap, /llms.txt and the game's launcher (/api/launcher/news). Its text is
 * in app/_components/news-body.tsx; `summary` is the plain-text version for search results, the
 * feed and structured data, so keep it in step with the text.
 */
export const NEWS = [
  {
    id: "marketplace",
    date: "8 Nov 2026",
    dateTime: "2026-11-08",
    title: "Items marketplace is now open!",
    summary:
      "The website market is open: list gear from your warehouse and buy from other players for Zen, Rena or Jewels of Bless, Soul, Life, Creation and Chaos.",
  },
  {
    id: "resets",
    date: "19 Oct 2026",
    dateTime: "2026-10-19",
    title: "Resets on the website",
    summary:
      "A character at the reset level can now reset on the website: back to the starting level, with all reset points free to assign. The cost rises each reset.",
  },
  {
    id: "rankings",
    date: "09 Oct 2026",
    dateTime: "2026-10-09",
    title: "Rankings are live",
    summary:
      "The rankings now cover players, guilds and who is online, and the Events tab shows the Blood Castle and Devil Square scores.",
  },
] as const;

export type NewsItem = (typeof NEWS)[number];
export type NewsId = NewsItem["id"];
