import { BRAND } from "@/constants/app";
import { NEWS } from "@/constants/news";
import type { LauncherNewsItem } from "@/lib/types/launcher";
import { getAbsoluteUrl } from "@/lib/utils/site-url";

/** The news for the game's launcher: a click opens each on the home page. */
export const GET = () => {
  const news: LauncherNewsItem[] = NEWS.map((item) => ({
    date: item.dateTime,
    title: item.title,
    author: BRAND,
    url: getAbsoluteUrl(`/#news-${item.id}`),
  }));

  return Response.json({ news }, { headers: { "Cache-Control": "no-cache" } });
};
