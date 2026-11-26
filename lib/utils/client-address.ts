/**
 * The visitor's address: Cloudflare's `CF-Connecting-IP`, else the first `X-Forwarded-For` entry
 * (Coolify's proxy). For limits only: a request that skips Cloudflare can set either header.
 */
export const getClientAddress = (headers: Headers): string =>
  headers.get("cf-connecting-ip")?.trim() ||
  headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";
