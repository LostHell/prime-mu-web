import { buildNewsRss } from "@/app/news/_utils/rss";

// Built once at build time from constants/news.ts and SITE_URL, like /llms.txt.
export const dynamic = "force-static";

export const GET = () => {
  return new Response(buildNewsRss(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
