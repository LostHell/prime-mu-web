import { getPageNumber, getSearchQuery } from "./pagination";

describe("getPageNumber", () => {
  test.each([undefined, "", "0", "-1", "1.5", "1e2", ["2"]])(
    "normalizes %p to the first page",
    (value) => {
      expect(getPageNumber(value)).toBe(1);
    },
  );

  test("accepts positive decimal integers", () => {
    expect(getPageNumber("42")).toBe(42);
  });

  test("rejects integers outside JavaScript's safe range", () => {
    expect(getPageNumber("9007199254740992")).toBe(1);
  });
});

describe("getSearchQuery", () => {
  test("trims and caps a single search value", () => {
    expect(getSearchQuery("  Jewel of Bless  ", 8)).toBe("Jewel of");
  });

  test("rejects repeated query parameters", () => {
    expect(getSearchQuery(["Sword", "Staff"], 80)).toBe("");
  });
});
