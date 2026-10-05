import { BOX_OF_LUCK_ITEM_LEVEL_MAP, isBoxOfLuckItem } from "./box-of-luck";
import { type ItemId } from "./types";

type FormatItemNameInput = {
  item: ItemId & {
    name: string;
    excellent?: number;
  };
  options?: {
    includeExcellent?: boolean;
  };
};
export const formatItemName = ({
  item,
  options,
}: FormatItemNameInput): string => {
  if (isBoxOfLuckItem(item.group, item.index)) {
    const variant = BOX_OF_LUCK_ITEM_LEVEL_MAP[item.level];
    if (variant) return variant.name;
  }

  const base = item.level > 0 ? `${item.name} +${item.level}` : item.name;

  if (options?.includeExcellent && item.excellent && item.excellent > 0) {
    return `Excellent ${base}`;
  }

  return base;
};
