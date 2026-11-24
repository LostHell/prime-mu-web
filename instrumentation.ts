// Runs once when a server starts. In production that is after every deploy, and the news, the
// pages and the sitemap change only with a deploy: tell the IndexNow search engines (Bing, Yandex)
// about every sitemap URL so they crawl the new version. Not awaited: the server starts at once.
export const register = async () => {
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.NODE_ENV !== "production"
  ) {
    return;
  }
  const [{ default: sitemap }, { submitToIndexNow }] = await Promise.all([
    import("@/app/sitemap"),
    import("@/lib/utils/indexnow"),
  ]);
  void submitToIndexNow(sitemap().map((entry) => entry.url));
};
