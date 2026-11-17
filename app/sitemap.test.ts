import { NEWS } from "@/constants/news";
import sitemap from "./sitemap";

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("lists every news page with its own date and dates the list by the newest", () => {
  process.env.SITE_URL = "https://blackmu.example";
  const entries = sitemap();

  expect(entries).toContainEqual({
    url: "https://blackmu.example/news",
    lastModified: NEWS[0].dateTime,
  });
  for (const item of NEWS) {
    expect(entries).toContainEqual({
      url: `https://blackmu.example/news/${item.id}`,
      lastModified: item.dateTime,
    });
  }
  expect(entries).toContainEqual({ url: "https://blackmu.example/faq" });
});
