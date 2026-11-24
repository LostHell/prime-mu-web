/** @jest-environment node */
import { submitToIndexNow } from "@/lib/utils/indexnow";
import { register } from "./instrumentation";

jest.mock("@/lib/utils/indexnow", () => ({
  submitToIndexNow: jest.fn().mockResolvedValue(true),
}));

const originalEnv = { ...process.env };

const setEnv = (values: Record<string, string>) => {
  process.env = { ...process.env, ...values };
};

afterEach(() => {
  process.env = { ...originalEnv };
  jest.mocked(submitToIndexNow).mockClear();
});

test("sends every sitemap URL when the production server starts", async () => {
  setEnv({
    NEXT_RUNTIME: "nodejs",
    NODE_ENV: "production",
    SITE_URL: "https://blackmu.example",
  });
  await register();

  const urls = jest.mocked(submitToIndexNow).mock.calls[0][0];
  expect(urls).toContain("https://blackmu.example/");
  expect(urls).toContain("https://blackmu.example/news");
});

test("sends nothing in development or on the edge runtime", async () => {
  setEnv({ NEXT_RUNTIME: "nodejs", NODE_ENV: "development" });
  await register();
  setEnv({ NEXT_RUNTIME: "edge", NODE_ENV: "production" });
  await register();

  expect(submitToIndexNow).not.toHaveBeenCalled();
});
