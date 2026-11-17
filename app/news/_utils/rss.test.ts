import { buildNewsRss } from "./rss";

jest.mock("@/constants/news", () => ({
  NEWS: [
    {
      id: "marketplace",
      date: "8 Oct 2026",
      dateTime: "2026-10-08",
      title: "Trade <now> & save",
      summary: 'Zen, "Rena" & jewels.',
    },
    {
      id: "rankings",
      date: "20 Sep 2026",
      dateTime: "2026-09-20",
      title: "Rankings are live",
      summary: "Players, guilds and who is online.",
    },
  ],
}));

const original = process.env.SITE_URL;

beforeEach(() => {
  process.env.SITE_URL = "https://blackmu.example";
});

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("lists each news item with its page, date and summary, newest first", () => {
  const rss = buildNewsRss();

  expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(rss).toContain("<title>Black MU news</title>");
  expect(rss).toContain(
    '<atom:link href="https://blackmu.example/news/rss.xml" rel="self" type="application/rss+xml"/>',
  );
  expect(rss).toContain(
    "<lastBuildDate>Thu, 08 Oct 2026 00:00:00 GMT</lastBuildDate>",
  );
  expect(rss.indexOf("/news/marketplace")).toBeLessThan(
    rss.indexOf("/news/rankings"),
  );
  expect(rss).toContain(
    '<guid isPermaLink="true">https://blackmu.example/news/rankings</guid>',
  );
  expect(rss).toContain("<pubDate>Sun, 20 Sep 2026 00:00:00 GMT</pubDate>");
});

test("escapes text so a title cannot break the XML", () => {
  const rss = buildNewsRss();

  expect(rss).toContain("<title>Trade &lt;now&gt; &amp; save</title>");
  expect(rss).toContain(
    "<description>Zen, &quot;Rena&quot; &amp; jewels.</description>",
  );
  expect(rss).not.toContain("<now>");
});
