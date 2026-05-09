import { isBoxOfLuckItem } from "../item-database/box-of-luck";
import type { ItemIconPathOptions } from "./types";
import { clampInt, parseTwoDigitCode } from "./utils";

const getVariantDigitsFromItemLevel = (
  itemGroup: number,
  itemIndex: number,
  itemLevel: number,
): string => {
  if (!isBoxOfLuckItem(itemGroup, itemIndex)) {
    return "00";
  }
  const boundedLevel = clampInt(itemLevel, 0, 99);
  return parseTwoDigitCode(String(boundedLevel));
};

export const getVariantDigitsForItemIcon = (
  itemGroup: number,
  itemIndex: number,
  options?: ItemIconPathOptions,
): string => {
  if (options?.variantSuffix !== undefined) {
    return parseTwoDigitCode(options.variantSuffix);
  }

  return getVariantDigitsFromItemLevel(
    itemGroup,
    itemIndex,
    options?.level ?? 0,
  );
};
