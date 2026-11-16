import "server-only";

const LOCAL_SITE_URL = "http://localhost:3000";

/** Set by `next build` (PHASE_PRODUCTION_BUILD in next/constants). */
const PRODUCTION_BUILD_PHASE = "phase-production-build";

/** Public origin used for canonical URLs, the sitemap, and Open Graph. */
export const getSiteUrl = () => {
  const configured = process.env.SITE_URL?.trim();
  if (!configured) {
    // robots.txt, the sitemap and /llms.txt are built once, at build time: without SITE_URL they
    // would point search engines at localhost. Fail the build (the running site keeps serving)
    // instead of shipping that.
    if (process.env.NEXT_PHASE === PRODUCTION_BUILD_PHASE) {
      throw new Error("SITE_URL must be set for a production build");
    }
    return LOCAL_SITE_URL;
  }

  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must be an http(s) URL");
  }
  return url.origin;
};

export const getAbsoluteUrl = (path: string) =>
  new URL(path, getSiteUrl()).toString();
