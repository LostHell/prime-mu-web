import { BRAND } from "@/constants/app";
import { SITE_DESCRIPTION } from "@/constants/server";
import type { JsonLdData } from "@/lib/utils/json-ld";
import { getAbsoluteUrl } from "@/lib/utils/site-url";

/** The game the downloads page installs, as the page and the home hero describe it. */
export const getGameJsonLd = (): JsonLdData => ({
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: BRAND,
  url: getAbsoluteUrl("/"),
  description: SITE_DESCRIPTION,
  image: getAbsoluteUrl("/hero-banner.jpg"),
  genre: "MMORPG",
  playMode: "MultiPlayer",
  applicationCategory: "Game",
  gamePlatform: ["Windows", "macOS"],
  operatingSystem: "Windows, macOS",
  publisher: { "@type": "Organization", name: BRAND, url: getAbsoluteUrl("/") },
});
