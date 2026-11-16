import { BRAND } from "@/constants/app";
import type { NewsItem } from "@/constants/news";
import type { JsonLdData } from "@/lib/utils/json-ld";
import { getAbsoluteUrl } from "@/lib/utils/site-url";

/** NewsArticle for a news page: the same title, summary and date the page shows. */
export const getNewsArticleJsonLd = (item: NewsItem): JsonLdData => {
  const url = getAbsoluteUrl(`/news/${item.id}`);
  const site = {
    "@type": "Organization",
    name: BRAND,
    url: getAbsoluteUrl("/"),
  };

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.dateTime,
    dateModified: item.dateTime,
    url,
    mainEntityOfPage: url,
    image: [getAbsoluteUrl("/hero-banner.jpg")],
    author: site,
    publisher: {
      ...site,
      logo: { "@type": "ImageObject", url: getAbsoluteUrl("/logo-emblem.png") },
    },
  };
};
