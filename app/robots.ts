import { getAbsoluteUrl } from "@/lib/utils/site-url";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/user-panel",
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
};

export default robots;
