import { getAbsoluteUrl } from "@/lib/utils/site-url";
import type { MetadataRoute } from "next";

const PUBLIC_PATHS = [
  "/",
  "/server-info",
  "/rankings",
  "/rankings?view=guilds",
  "/rankings?view=online",
  "/rankings?view=events",
  "/downloads",
  "/login",
  "/register",
];

const sitemap = (): MetadataRoute.Sitemap => {
  return PUBLIC_PATHS.map((path) => ({ url: getAbsoluteUrl(path) }));
};

export default sitemap;
