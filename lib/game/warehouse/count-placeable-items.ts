import "server-only";

import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemId } from "@/lib/game/item-database/types";
import { findFreeAreas } from "@/lib/game/item-decoder";
import { type BinaryItemData } from "@/lib/game/item-decoder/types";
import { ActionError } from "@/lib/errors/action-error";

/** How many additional items of this type fit, up to `maxCount`. */
export const countPlaceableItems = (
  data: BinaryItemData,
  itemId: ItemId,
  maxCount: number,
): number => {
  if (maxCount <= 0) return 0;

  const itemDef = getItemDefinition(itemId);
  if (!itemDef) return 0;
  try {
    return findFreeAreas(
      data,
      itemDef?.width ?? 1,
      itemDef?.height ?? 1,
      Math.min(maxCount, WAREHOUSE_SLOTS),
    ).length;
  } catch (error) {
    if (error instanceof ActionError) return 0;
    throw error;
  }
};
