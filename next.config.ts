import type { NextConfig } from "next";
import { cdnCacheHeaders } from "./lib/utils/cdn-cache";

// Sent with every response. No Content-Security-Policy yet: it needs testing against every page first.
const securityHeaders = [
  // Browsers ignore it over plain http, so local development is unaffected.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.11", "192.168.0.59"],
  poweredByHeader: false,
  headers: async () => [
    { source: "/:path*", headers: securityHeaders },
    ...cdnCacheHeaders(),
  ],
};

export default nextConfig;
