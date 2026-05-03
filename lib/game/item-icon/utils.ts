export const clampInt = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, Math.trunc(value)));
};

/** Normalizes input to two decimal digits (GIF name tail `VV`). */
export const parseTwoDigitCode = (raw: string): string => {
  return raw.replace(/\D/g, "").padStart(2, "0").slice(-2);
};
