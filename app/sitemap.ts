import { getAbsoluteUrl } from "@/lib/utils/site-url";
import { LEGAL_LINKS } from "@/constants/legal";
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
  "/login",
  "/register",
  ...LEGAL_LINKS.map((link) => link.href),
];

const sitemap = (): MetadataRoute.Sitemap => {
  return PUBLIC_PATHS.map((path) => ({ url: getAbsoluteUrl(path) }));
};

export default sitemap;
