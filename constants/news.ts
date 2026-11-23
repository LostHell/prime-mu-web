/**
 * The news, newest first. Each item has its own page, /news/<id>; its summary is on the home page, in
 * /news/rss.xml, the sitemap, /llms.txt and the game's launcher (/api/launcher/news). Its text is
 * in app/_components/news-body.tsx; `summary` is the plain-text version for search results, the
 * feed and structured data, so keep it in step with the text.
 */
export const NEWS = [
  {
    id: "afk-credits",
    date: "23 Nov 2026",
    dateTime: "2026-11-23",
    title: "AFK credits: earn them in game, spend them on the market",
    summary:
      "Stay online in Davias town or the Arena to earn credits, then buy items with them on the market or sell your own items for credits, zen or jewels.",
  },
  {
    id: "quests",
    date: "23 Nov 2026",
    dateTime: "2026-11-23",
    title: "Quests in the new quest window",
    summary:
      "Press T in the game for the quest window: quests that open one after another, with jewels, zen, Boxes of Kundun and stat points that stay after resets.",
  },
  {
    id: "game-keys",
    date: "23 Nov 2026",
    dateTime: "2026-11-23",
    title: "New keys: quests, map, events, autoclick and camera",
    summary:
      "T opens the quest window, M the Move list, H the Event Timer and Tab the map; F9 to F12 run autoclick, the 3D camera and hide the game.",
  },
  {
    id: "official-launch",
    date: "19 Nov 2026",
    dateTime: "2026-11-19",
    title: "Black MU is open: official launch on 20 December",
    summary:
      "Black MU is already open: register, download the launcher and play now. The official launch of the server is on 20 December 2026.",
  },
  {
    id: "play-mu-online-on-mac",
    date: "19 Nov 2026",
    dateTime: "2026-11-19",
    title: "How to play MU Online on Mac",
    summary:
      "Play Black MU on macOS: download the Mac launcher, move MU to Applications, open it once with right-click and Open, then log in with your account.",
  },
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

/** How many of the newest items the home page shows; /news has them all. */
export const HOME_NEWS_COUNT = 5;

export type NewsItem = (typeof NEWS)[number];
export type NewsId = NewsItem["id"];
