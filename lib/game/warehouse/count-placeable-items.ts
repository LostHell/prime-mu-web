import "server-only";

import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemId } from "@/lib/game/item-database/types";
import { findFreeAreas } from "@/lib/game/item-decoder";
import { type BinaryItemData } from "@/lib/game/item-decoder/types";

/** How many additional items of this type fit, up to `maxCount`. */
export const countPlaceableItems = (
  data: BinaryItemData,
  itemId: ItemId,
  maxCount: number,
): number => {
  if (maxCount <= 0) return 0;

  const itemDef = getItemDefinition(itemId);
  return findFreeAreas(
    data,
    itemDef?.width ?? 1,
    itemDef?.height ?? 1,
    Math.min(maxCount, WAREHOUSE_SLOTS),
  ).length;
};
