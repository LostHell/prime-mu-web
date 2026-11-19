import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import {
  CDN_CACHE_HEADER,
  CONTENT_CDN_CACHE,
  LIVE_CDN_CACHE,
  PRIVATE_CDN_CACHE,
  cdnCacheHeaders,
} from "./cdn-cache";

// The header Next sends for a path, the way it matches `headers()` sources (the last match wins).
const cdnCacheFor = (path: string) =>
  cdnCacheHeaders()
    .filter((rule) => getPathMatch(rule.source)(path) !== false)
    .map((rule) => rule.headers.find((h) => h.key === CDN_CACHE_HEADER)?.value)
    .at(-1);

test("keeps pages with live game data in Cloudflare for a minute", () => {
  for (const path of [
    "/",
    "/rankings",
    "/server-info",
    "/downloads",
    "/faq",
    "/news",
  ]) {
    expect([path, cdnCacheFor(path)]).toEqual([path, LIVE_CDN_CACHE]);
  }
  expect(LIVE_CDN_CACHE).toContain("max-age=60,");
});

test("keeps pages that change only on a deploy for an hour", () => {
  for (const path of [
    "/rules",
    "/terms",
    "/privacy",
    "/news/season-1-launch",
    "/news/rss.xml",
    "/llms.txt",
  ]) {
    expect([path, cdnCacheFor(path)]).toEqual([path, CONTENT_CDN_CACHE]);
  }
  expect(CONTENT_CDN_CACHE).toContain("max-age=3600,");
});

test("lets Cloudflare serve the last copy for a day while the site is down", () => {
  expect(LIVE_CDN_CACHE).toContain("stale-if-error=86400");
  expect(CONTENT_CDN_CACHE).toContain("stale-if-error=86400");
});

test("forbids Cloudflare to keep the user panel and the sign-in pages", () => {
  for (const path of [
    "/user-panel",
    "/user-panel/market/sell",
    "/login",
    "/register",
  ]) {
    expect([path, cdnCacheFor(path)]).toEqual([path, PRIVATE_CDN_CACHE]);
  }
});

test("sends nothing for the API, Next's files, the launcher's files and unknown pages", () => {
  for (const path of [
    "/api/auth/session",
    "/api/launcher/status",
    "/_next/static/chunks/app.js",
    "/_next/image",
    "/patches/manifest.json",
    "/downloads/launcher/windows/BlackMU-Setup.exe",
    "/images/items/0_Kris/icon.png",
    "/news/a/b",
    "/rankings/extra",
    "/login-help",
  ]) {
    expect([path, cdnCacheFor(path)]).toEqual([path, undefined]);
  }
});

test("caches a page only for a guest's HTML request, never with a session cookie or for the client router", () => {
  const publicRules = cdnCacheHeaders().filter(
    (rule) => rule.headers[0].value !== PRIVATE_CDN_CACHE,
  );

  for (const rule of publicRules) {
    expect(rule.missing).toEqual([
      { type: "cookie", key: "authjs.session-token" },
      { type: "cookie", key: "__Secure-authjs.session-token" },
      { type: "header", key: "rsc" },
    ]);
  }
});

test("marks private pages no-store for everyone, signed in or not", () => {
  const privateRules = cdnCacheHeaders().filter(
    (rule) => rule.headers[0].value === PRIVATE_CDN_CACHE,
  );

  expect(privateRules).toHaveLength(3);
  for (const rule of privateRules) {
    expect(rule.missing).toBeUndefined();
  }
});
