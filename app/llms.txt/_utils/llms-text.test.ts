import { buildLlmsText } from "./llms-text";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("states the server settings the site shows", () => {
  const text = buildLlmsText();

  expect(text.startsWith("# Black MU\n\n> Black MU is a MU Online")).toBe(true);
  expect(text).toContain("- Experience rate: 10x");
  expect(text).toContain("- Drop rate: 20%");
  expect(text).toContain("- Max level: 300");
  expect(text).toContain(
    "- Resets: at level 300, 100 points per reset, up to 3 resets. The first reset costs 1,000 zen",
  );
  expect(text).toContain(
    "- Points per level: Dark Wizard 5, Dark Knight 5, Fairy Elf 5, Magic Gladiator 7",
  );
  expect(text).toContain("launched on 11 October 2026");
});

test("lists every enabled event with its schedule, length and bonus", () => {
  const text = buildLlmsText();

  expect(text).toContain("## Events (UTC)");
  expect(text).toContain("- Happy Hour: 20:00 (60 min, +150% experience)");
});

test("includes the FAQ questions with their answers", () => {
  const text = buildLlmsText();

  expect(text).toContain("## FAQ");
  expect(text).toContain("### What is Black MU?");
  expect(text).toContain("### How do resets work?");
});

test("links every page with the public origin", () => {
  process.env.SITE_URL = "https://blackmu.example";

  const text = buildLlmsText();

  expect(text).toContain(
    "- [Server info](https://blackmu.example/server-info): ",
  );
  expect(text).toContain(
    "- [Guild rankings](https://blackmu.example/rankings?view=guilds)",
  );
  expect(text).toContain(
    "- [FAQ](https://blackmu.example/faq): short answers about the server",
  );
  expect(text).toContain(
    "- [Items marketplace is now open!](https://blackmu.example/#news-marketplace): 2026-10-08",
  );
  expect(text).not.toContain("localhost");
});
