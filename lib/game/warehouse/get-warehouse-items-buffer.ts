import "server-only";

import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
} from "@/lib/game/item-decoder/constants";
import { type BinaryItemData } from "@/lib/game/item-decoder/types";

/** A copy of the warehouse items blob, or an empty warehouse if none exists. */
export const getWarehouseItemsBuffer = (
  warehouseItems?: BinaryItemData | null,
): Buffer => {
  if (warehouseItems) {
    return Buffer.from(warehouseItems);
  }

  return Buffer.alloc(WAREHOUSE_SLOTS * BYTES_PER_SLOT, EMPTY_SLOT_BYTE);
};
