import { SITE_FAQ } from "./site-faq";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

const answerTo = (question: string) =>
  SITE_FAQ.find((item) => item.question === question)?.answer;

test("takes its figures from the server config", () => {
  expect(answerTo("What is Black MU?")).toBe(
    "Black MU is a classic MU Online 0.97d private server with 10x experience, 20% drop and a max level of 300. It launched on 11 October 2026.",
  );
  expect(answerTo("How do resets work?")).toContain(
    "A character can reset at level 300, up to 3 times. Each reset gives 100 points",
  );
  expect(answerTo("How do resets work?")).toContain(
    "The first reset costs 1,000 zen",
  );
  expect(answerTo("How do I clear my PK status?")).toContain(
    "15,000,000 zen per kill",
  );
});

test("summarises every enabled event with its bonus", () => {
  expect(answerTo("When are the events?")).toBe(
    "All times are UTC. Happy Hour: 20:00 (+150% experience).",
  );
});

test("names every currency a market listing can use", () => {
  expect(answerTo("Can I trade items on the website?")).toContain(
    "Zen, Rena, Jewel of Bless, Jewel of Soul, Jewel of Life, Jewel of Creation or Jewel of Chaos.",
  );
});

test("links each detailed answer to a page that covers it", () => {
  const links = SITE_FAQ.flatMap((item) => (item.link ? [item.link.href] : []));

  expect(links).toEqual(
    expect.arrayContaining([
      "/downloads",
      "/server-info#resets",
      "/server-info#events",
    ]),
  );
});
