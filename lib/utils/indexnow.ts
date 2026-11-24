import "server-only";
import { getSiteUrl } from "@/lib/utils/site-url";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// IndexNow keys are 8 to 128 letters, digits or dashes.
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/** Where the key is served (app/indexnow-key.txt), so the search engines can check it is ours. */
export const INDEXNOW_KEY_PATH = "/indexnow-key.txt";

export const getIndexNowKey = () => {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "";
  return KEY_PATTERN.test(key) ? key : null;
};

const isPublicHost = (hostname: string) =>
  !LOCAL_HOSTS.includes(hostname) &&
  !hostname.endsWith(".localhost") &&
  !hostname.endsWith(".test");

export const buildIndexNowPayload = (urls: string[], key: string) => {
  const siteUrl = getSiteUrl();
  return {
    host: new URL(siteUrl).host,
    key,
    keyLocation: new URL(INDEXNOW_KEY_PATH, siteUrl).toString(),
    urlList: urls,
  };
};

/**
 * Tells Bing, Yandex and the other IndexNow search engines that these URLs changed. Does nothing
 * without INDEXNOW_KEY or on a local SITE_URL, and never throws.
 */
export const submitToIndexNow = async (urls: string[]) => {
  const key = getIndexNowKey();
  if (
    !key ||
    urls.length === 0 ||
    !isPublicHost(new URL(getSiteUrl()).hostname)
  ) {
    return false;
  }
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(buildIndexNowPayload(urls, key)),
      signal: AbortSignal.timeout(10_000),
    });
    console.log(`IndexNow: ${urls.length} URLs, HTTP ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error("IndexNow: submission failed", error);
    return false;
  }
};
