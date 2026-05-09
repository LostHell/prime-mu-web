import { BOX_OF_LUCK_ITEM_LEVEL_MAP, isBoxOfLuckItem } from "./box-of-luck";
import { getItemDatabase, getItemKey } from "./database";
import { type ItemDefinition } from "./types";

export const getItemDefinition = (
  group: number,
  index: number,
  level: number,
): ItemDefinition | undefined => {
  const database = getItemDatabase();
  const item = database.get(getItemKey(group, index));

  if (!item) return undefined;

  if (isBoxOfLuckItem(group, index)) {
    return {
      ...item,
      name: BOX_OF_LUCK_ITEM_LEVEL_MAP[level].name,
    };
  }
  return item;
};
