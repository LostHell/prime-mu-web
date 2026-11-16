import { buildLlmsText } from "@/app/llms.txt/_utils/llms-text";

// Built once at build time, like robots.txt and the sitemap: it reads only constants and SITE_URL.
export const dynamic = "force-static";

export const GET = () => {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
