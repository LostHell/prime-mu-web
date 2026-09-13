import { bigIntToSafeNumber, formatNumber, parseAmountInput } from "./numbers";

describe("bigIntToSafeNumber", () => {
  test("converts a normal BigInt to a Number", () => {
    expect(bigIntToSafeNumber(42n)).toBe(42);
  });

  test("clamps values above MAX_SAFE_INTEGER instead of losing precision", () => {
    const huge = BigInt(Number.MAX_SAFE_INTEGER) + 1000n;
    expect(bigIntToSafeNumber(huge)).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe("formatNumber", () => {
  test("formats with comma thousands separators regardless of runtime locale", () => {
    expect(formatNumber(10_000_000_122)).toBe("10,000,000,122");
  });

  test("formats small numbers without separators", () => {
    expect(formatNumber(42)).toBe("42");
  });
});

describe("parseAmountInput", () => {
  test("returns 0 for empty or whitespace-only input", () => {
    expect(parseAmountInput("")).toBe(0);
    expect(parseAmountInput("   ")).toBe(0);
  });

  test("parses integers and strips thousands separators", () => {
    expect(parseAmountInput("42")).toBe(42);
    expect(parseAmountInput("1,000,000")).toBe(1_000_000);
  });

  test("returns null for non-integers so the keystroke can be ignored", () => {
    expect(parseAmountInput("1.5")).toBeNull();
    expect(parseAmountInput("1e3")).toBeNull();
    expect(parseAmountInput("-1")).toBeNull();
    expect(parseAmountInput("abc")).toBeNull();
  });
});
