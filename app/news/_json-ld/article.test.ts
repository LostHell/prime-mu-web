import { NEWS } from "@/constants/news";
import { getNewsArticleJsonLd } from "./article";

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("describes a news item with the title, summary and date its page shows", () => {
  process.env.SITE_URL = "https://blackmu.example";
  const item = NEWS[0];

  expect(getNewsArticleJsonLd(item)).toMatchObject({
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    datePublished: item.dateTime,
    url: `https://blackmu.example/news/${item.id}`,
    mainEntityOfPage: `https://blackmu.example/news/${item.id}`,
    publisher: {
      name: "Black MU",
      logo: { url: "https://blackmu.example/logo-emblem.png" },
    },
  });
});
