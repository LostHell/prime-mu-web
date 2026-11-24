import { getIndexNowKey } from "@/lib/utils/indexnow";

// INDEXNOW_KEY is a runtime variable, so the key is read on each request, not at build time.
export const dynamic = "force-dynamic";

export const GET = () => {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
