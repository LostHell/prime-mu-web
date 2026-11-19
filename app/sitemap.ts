import { getAbsoluteUrl } from "@/lib/utils/site-url";
import { LEGAL_LINKS } from "@/constants/legal";
import { NEWS } from "@/constants/news";
import type { MetadataRoute } from "next";

const PUBLIC_PATHS = [
  "/",
  "/server-info",
  "/rankings",
  "/rankings?view=guilds",
  "/rankings?view=online",
  "/rankings?view=events",
  "/downloads",
  "/faq",
  ...LEGAL_LINKS.map((link) => link.href),
];

const sitemap = (): MetadataRoute.Sitemap => {
  // News pages carry their real date; the newest one dates the /news list.
  const news = [
    ...(NEWS.length > 0
      ? [{ url: getAbsoluteUrl("/news"), lastModified: NEWS[0].dateTime }]
      : []),
    ...NEWS.map((item) => ({
      url: getAbsoluteUrl(`/news/${item.id}`),
      lastModified: item.dateTime,
    })),
  ];
  return [
    ...PUBLIC_PATHS.map((path) => ({ url: getAbsoluteUrl(path) })),
    ...news,
  ];
};

export default sitemap;
