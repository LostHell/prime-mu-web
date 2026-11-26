import type { NextConfig } from "next";

type HeaderRule = Awaited<
  ReturnType<NonNullable<NextConfig["headers"]>>
>[number];

// Only Cloudflare reads this header. Browsers keep Next's `Cache-Control: no-store` on pages.
export const CDN_CACHE_HEADER = "Cloudflare-CDN-Cache-Control";

// Pages with live game data: the online/offline status (5 s in the app), the online count, the
// rankings and the online list (5–30 s in the app), the launcher downloads (change on a release
// upload, not on a deploy). A minute keeps them close to live and still takes the load off.
export const LIVE_CDN_CACHE = "public, max-age=60, stale-if-error=86400";
// Pages that change only on a deploy, which purges the Cloudflare cache.
export const CONTENT_CDN_CACHE = "public, max-age=3600, stale-if-error=86400";
export const PRIVATE_CDN_CACHE = "no-store";

export const LIVE_PAGES = [
  "/",
  "/rankings",
  "/server-info",
  "/downloads",
  "/faq",
  "/news",
];
export const CONTENT_PAGES = [
  "/rules",
  "/terms",
  "/privacy",
  "/news/:id",
  "/llms.txt",
];
export const PRIVATE_PAGES = [
  "/user-panel/:path*",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Auth.js's session cookie: `__Secure-` on the https site, plain on http.
export const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

// A signed-in visitor sees their account in the header, and a client router (`RSC`) request gets an
// RSC payload instead of HTML on the same URL: neither may be cached for everyone.
const guestPageRequest: HeaderRule["missing"] = [
  ...SESSION_COOKIES.map((key) => ({ type: "cookie" as const, key })),
  { type: "header", key: "rsc" },
];

const cdnCacheRule = (source: string, value: string): HeaderRule => ({
  source,
  missing: guestPageRequest,
  headers: [{ key: CDN_CACHE_HEADER, value }],
});

/** The `Cloudflare-CDN-Cache-Control` header of each page. Paths not listed get none, so Cloudflare does not cache them. */
export const cdnCacheHeaders = (): HeaderRule[] => [
  ...LIVE_PAGES.map((source) => cdnCacheRule(source, LIVE_CDN_CACHE)),
  ...CONTENT_PAGES.map((source) => cdnCacheRule(source, CONTENT_CDN_CACHE)),
  ...PRIVATE_PAGES.map((source) => ({
    source,
    headers: [{ key: CDN_CACHE_HEADER, value: PRIVATE_CDN_CACHE }],
  })),
];
