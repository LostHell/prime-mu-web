import { BOX_OF_LUCK_ITEM_LEVEL_MAP, isBoxOfLuckItem } from "./box-of-luck";

type FormatItemNameInput = {
  item: {
    name: string;
    group: number;
    index: number;
    level: number;
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
    return BOX_OF_LUCK_ITEM_LEVEL_MAP[item.level].name;
  }

  const base = item.level > 0 ? `${item.name} +${item.level}` : item.name;

  if (options?.includeExcellent && item.excellent && item.excellent > 0) {
    return `Excellent ${base}`;
  }

  return base;
};
