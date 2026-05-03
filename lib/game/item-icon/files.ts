import { clampInt } from "./utils";

/** Builds the GIF file name for an item icon. */
export const buildItemIconGifFileName = (
  itemGroup: number,
  itemIndex: number,
  variantDigits: string,
): string => {
  const groupDigits = clampInt(itemGroup, 0, 15).toString().padStart(2, "0");
  const indexDigits = clampInt(itemIndex, 0, 999).toString().padStart(3, "0");
  return `${groupDigits}${indexDigits}${variantDigits}.gif`;
};
