import type { ItemIconPathOptions } from "./types";
import { clampInt, parseTwoDigitCode } from "./utils";

const isBoxOfLuckItem = (itemGroup: number, itemIndex: number): boolean => {
  const BOX_OF_LUCK = { group: 14, index: 11 };

  return itemGroup === BOX_OF_LUCK.group && itemIndex === BOX_OF_LUCK.index;
};

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
