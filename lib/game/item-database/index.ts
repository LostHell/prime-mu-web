import { BOX_OF_LUCK_ITEM_LEVEL_MAP, isBoxOfLuckItem } from "./box-of-luck";
import { getItemDatabase, getItemKey } from "./database";
import { type ItemDefinition, type ItemId } from "./types";

export const getItemDefinition = (
  itemId: ItemId,
): ItemDefinition | undefined => {
  const database = getItemDatabase();
  const { group, index, level } = itemId;
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
