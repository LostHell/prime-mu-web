/** @jest-environment node */
import { GET } from "./route";

const original = process.env.INDEXNOW_KEY;

afterEach(() => {
  if (original === undefined) {
    delete process.env.INDEXNOW_KEY;
  } else {
    process.env.INDEXNOW_KEY = original;
  }
});

test("serves the key as plain text", async () => {
  process.env.INDEXNOW_KEY = "a1b2c3d4e5f60718";
  const response = GET();

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/plain");
  await expect(response.text()).resolves.toBe("a1b2c3d4e5f60718");
});

test("is a 404 without a valid key", () => {
  delete process.env.INDEXNOW_KEY;
  expect(GET().status).toBe(404);
  process.env.INDEXNOW_KEY = "short";
  expect(GET().status).toBe(404);
});
