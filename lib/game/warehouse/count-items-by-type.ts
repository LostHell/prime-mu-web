import { type ItemId } from "@/lib/game/item-database/types";
import { decodeItems } from "@/lib/game/item-decoder/decode";
import { type BinaryItemData } from "@/lib/game/item-decoder/types";

/** Returns the number of items matching the given group+index+level in the buffer. */
export const countItemsByType = (
  data: BinaryItemData,
  itemId: ItemId,
): number =>
  decodeItems(data).filter(
    (item) =>
      item.group === itemId.group &&
      item.index === itemId.index &&
      item.level === itemId.level,
  ).length;
