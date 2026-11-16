import { BRAND } from "@/constants/app";
import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Open Graph shared by every page. Next.js does not merge `openGraph` objects: a page that sets
 * its own replaces the layout's, so it starts from this one (see `openGraphFor`).
 */
export const SITE_OPEN_GRAPH = {
  type: "website",
  siteName: BRAND,
  locale: "en_US",
  images: [
    {
      url: "/hero-banner.jpg",
      width: 1920,
      height: 1080,
      alt: `${BRAND} castle`,
    },
  ],
} satisfies OpenGraph;

/** The site's Open Graph with og:url set to the page's canonical path (resolved against metadataBase). */
export const openGraphFor = (path: string): OpenGraph => ({
  ...SITE_OPEN_GRAPH,
  url: path,
});
