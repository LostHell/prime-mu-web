import { getAbsoluteUrl } from "@/lib/utils/site-url";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The user panel needs a login; /api and /patches are for the game launcher, not for search.
      disallow: ["/user-panel", "/api/", "/patches/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
};

export default robots;
