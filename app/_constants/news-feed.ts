import { BRAND } from "@/constants/app";

export const NEWS_FEED_PATH = "/news/rss.xml";

/** `alternates.types` for pages that should point feed readers to the news feed. */
export const NEWS_FEED_ALTERNATE = {
  "application/rss+xml": [{ url: NEWS_FEED_PATH, title: `${BRAND} news` }],
};
