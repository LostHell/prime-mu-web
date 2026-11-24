/** @jest-environment node */
import {
  buildIndexNowPayload,
  getIndexNowKey,
  submitToIndexNow,
} from "./indexnow";

const KEY = "a1b2c3d4e5f60718";
const originalEnv = { ...process.env };
const originalFetch = global.fetch;

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  process.env = { ...originalEnv };
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

test("accepts only well-formed keys", () => {
  process.env.INDEXNOW_KEY = ` ${KEY} `;
  expect(getIndexNowKey()).toBe(KEY);
  process.env.INDEXNOW_KEY = "short";
  expect(getIndexNowKey()).toBeNull();
  process.env.INDEXNOW_KEY = "has spaces in it";
  expect(getIndexNowKey()).toBeNull();
  delete process.env.INDEXNOW_KEY;
  expect(getIndexNowKey()).toBeNull();
});

test("names the host and the key location on the site", () => {
  process.env.SITE_URL = "https://blackmu.example";
  expect(
    buildIndexNowPayload(["https://blackmu.example/news/quests"], KEY),
  ).toEqual({
    host: "blackmu.example",
    key: KEY,
    keyLocation: "https://blackmu.example/indexnow-key.txt",
    urlList: ["https://blackmu.example/news/quests"],
  });
});

test("posts the URLs on a public site", async () => {
  process.env.SITE_URL = "https://blackmu.example";
  process.env.INDEXNOW_KEY = KEY;
  const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
  global.fetch = fetchMock;

  await expect(
    submitToIndexNow([
      "https://blackmu.example/",
      "https://blackmu.example/faq",
    ]),
  ).resolves.toBe(true);
  expect(fetchMock).toHaveBeenCalledWith(
    "https://api.indexnow.org/indexnow",
    expect.objectContaining({ method: "POST" }),
  );
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).urlList).toHaveLength(2);
});

test("does nothing without a key, without URLs or on a local site", async () => {
  const fetchMock = jest.fn();
  global.fetch = fetchMock;
  process.env.SITE_URL = "https://blackmu.example";
  delete process.env.INDEXNOW_KEY;
  await expect(submitToIndexNow(["https://blackmu.example/"])).resolves.toBe(
    false,
  );

  process.env.INDEXNOW_KEY = KEY;
  await expect(submitToIndexNow([])).resolves.toBe(false);

  process.env.SITE_URL = "http://localhost:3000";
  await expect(submitToIndexNow(["http://localhost:3000/"])).resolves.toBe(
    false,
  );
  expect(fetchMock).not.toHaveBeenCalled();
});

test("reports a failed request instead of throwing", async () => {
  process.env.SITE_URL = "https://blackmu.example";
  process.env.INDEXNOW_KEY = KEY;
  global.fetch = jest.fn().mockRejectedValue(new Error("offline"));

  await expect(submitToIndexNow(["https://blackmu.example/"])).resolves.toBe(
    false,
  );
});
