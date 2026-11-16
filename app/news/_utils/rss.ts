import { BRAND } from "@/constants/app";
import { NEWS } from "@/constants/news";
import { getAbsoluteUrl } from "@/lib/utils/site-url";
import { NEWS_FEED_PATH } from "@/app/_constants/news-feed";

const escapeXml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

/** A calendar date (2026-10-08) as an RSS date, at midnight UTC. */
const rssDate = (dateTime: string) =>
  new Date(`${dateTime}T00:00:00Z`).toUTCString();

/** RSS 2.0 feed of the news, newest first. */
export const buildNewsRss = (): string => {
  const items = NEWS.map((item) => {
    const url = getAbsoluteUrl(`/news/${item.id}`);
    return [
      "<item>",
      `<title>${escapeXml(item.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<pubDate>${rssDate(item.dateTime)}</pubDate>`,
      `<description>${escapeXml(item.summary)}</description>`,
      "</item>",
    ].join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(`${BRAND} news`)}</title>`,
    `<link>${escapeXml(getAbsoluteUrl("/news"))}</link>`,
    `<description>${escapeXml(`News from ${BRAND}, the MU Online private server.`)}</description>`,
    "<language>en</language>",
    `<atom:link href="${escapeXml(getAbsoluteUrl(NEWS_FEED_PATH))}" rel="self" type="application/rss+xml"/>`,
    ...(NEWS.length > 0
      ? [`<lastBuildDate>${rssDate(NEWS[0].dateTime)}</lastBuildDate>`]
      : []),
    ...items,
    "</channel>",
    "</rss>",
    "",
  ].join("\n");
};
