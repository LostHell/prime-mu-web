import { type ItemId } from "@/lib/game/item-database/types";
import { decodeItems } from "@/lib/game/item-decoder/decode";
import { clearWarehouseSlot } from "@/lib/game/item-decoder/slots";
import { type BinaryItemData } from "@/lib/game/item-decoder/types";

/**
 * Clears the first `count` slots matching group+index+level from the buffer.
 * Returns a new Buffer. Throws if fewer than `count` matching items are found.
 */
export const removeItemsByType = (
  data: BinaryItemData,
  itemId: ItemId,
  count: number,
): Buffer => {
  const { group, index, level } = itemId;

  const matchingSlots = decodeItems(data)
    .filter(
      (item) =>
        item.group === group && item.index === index && item.level === level,
    )
    .slice(0, count)
    .map((item) => item.slot);

  if (matchingSlots.length < count) {
    throw new Error(
      `Only ${matchingSlots.length} item(s) found, but ${count} were requested.`,
    );
  }

  return matchingSlots.reduce<Buffer>(
    (buffer, slot) => clearWarehouseSlot(buffer, slot),
    Buffer.from(data),
  );
};
