import { bigIntToSafeNumber, formatNumber } from "./numbers";

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
