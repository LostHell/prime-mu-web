/** @jest-environment node */
import { NEWS } from "@/constants/news";
import { GET } from "./route";

test("gives the launcher each news item's title, date and its place on the home page", async () => {
  process.env.SITE_URL = "https://prime-mu.example";
  try {
    const { news } = await GET().json();

    expect(news).toHaveLength(NEWS.length);
    expect(news[0]).toEqual({
      date: NEWS[0].dateTime,
      title: NEWS[0].title,
      author: "Prime Mu",
      url: `https://prime-mu.example/#news-${NEWS[0].id}`,
    });
  } finally {
    delete process.env.SITE_URL;
  }
});
