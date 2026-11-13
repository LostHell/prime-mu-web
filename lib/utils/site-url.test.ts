import { getAbsoluteUrl, getSiteUrl } from "./site-url";

const original = process.env.SITE_URL;

afterEach(() => {
  if (original === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = original;
  }
});

test("uses localhost when the site url is unset", () => {
  delete process.env.SITE_URL;

  expect(getSiteUrl()).toBe("http://localhost:3000");
  expect(getAbsoluteUrl("/rankings?view=guilds")).toBe(
    "http://localhost:3000/rankings?view=guilds",
  );
});

test("uses the configured origin and drops any path", () => {
  process.env.SITE_URL = " https://blackmu.example/play ";

  expect(getSiteUrl()).toBe("https://blackmu.example");
  expect(getAbsoluteUrl("/downloads")).toBe("https://blackmu.example/downloads");
});

test("rejects a site url that is not absolute", () => {
  process.env.SITE_URL = "blackmu.example";

  expect(() => getSiteUrl()).toThrow();
});

test("rejects a site url that is not http(s)", () => {
  process.env.SITE_URL = "javascript:alert(1)";

  expect(() => getSiteUrl()).toThrow(/http/);
});
