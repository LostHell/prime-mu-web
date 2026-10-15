import "server-only";

const LOCAL_SITE_URL = "http://localhost:3000";

/** Public origin used for canonical URLs, the sitemap, and Open Graph. */
export const getSiteUrl = () => {
  const configured = process.env.SITE_URL?.trim();
  if (!configured) return LOCAL_SITE_URL;

  const url = new URL(configured);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must be an http(s) URL");
  }
  return url.origin;
};

export const getAbsoluteUrl = (path: string) =>
  new URL(path, getSiteUrl()).toString();
