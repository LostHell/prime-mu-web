/** Converts a BigInt to a Number for display, clamping to `Number.MAX_SAFE_INTEGER`
 * instead of silently losing precision for values above it. Useful for BigInt
 * database columns (e.g. balances) that can exceed a regular Int column's range. */
export const bigIntToSafeNumber = (value: bigint): number => {
  return value > Number.MAX_SAFE_INTEGER
    ? Number.MAX_SAFE_INTEGER
    : Number(value);
};

/** Formats a number with thousands separators using a fixed locale. Plain
 * `n.toLocaleString()` uses the runtime's default locale, which can differ
 * between the server and the browser and causes a hydration mismatch when
 * rendered directly (e.g. "10.000.000" vs "10,000,000" for the same value). */
export const formatNumber = (value: number): string =>
  value.toLocaleString("en-US");

/** Parses a user-typed amount. Empty → 0 so the field can be cleared while
 * typing. Commas are stripped so pasted formatted values like "1,000" work.
 * Returns `null` for non-integers so the caller can ignore the keystroke. */
export const parseAmountInput = (value: string): number | null => {
  const cleaned = value.replace(/,/g, "").trim();
  if (cleaned === "") return 0;
  if (!/^\d+$/.test(cleaned)) return null;
  const parsed = Number(cleaned);
  if (!Number.isSafeInteger(parsed)) return null;
  return parsed;
};

/** Clamps an already-parsed amount to `[min, max]`. Shared by every
 * currency-input control (deposit/withdraw transfer amount, market listing
 * prices) so they all round/bound values the same way. */
export const clampAmount = (
  value: number,
  min: number,
  max: number,
): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
};
