import { getClientDownloadUrl } from "./client-download-url";

test("accepts an absolute http(s) url and a same-site path", () => {
  expect(getClientDownloadUrl(" https://files.example/windows.zip ")).toBe(
    "https://files.example/windows.zip",
  );
  expect(getClientDownloadUrl("/clients/windows.zip")).toBe(
    "/clients/windows.zip",
  );
});

test("rejects a missing, relative, or script url", () => {
  expect(getClientDownloadUrl(undefined)).toBeNull();
  expect(getClientDownloadUrl("   ")).toBeNull();
  expect(getClientDownloadUrl("windows.zip")).toBeNull();
  expect(getClientDownloadUrl("//files.example/windows.zip")).toBeNull();
  expect(getClientDownloadUrl("javascript:alert(1)")).toBeNull();
});
