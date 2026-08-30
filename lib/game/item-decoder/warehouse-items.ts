import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  ITEM_TYPE_EXTENDED_FLAG_MASK,
  ITEM_TYPE_GROUP_SIZE,
} from "./constants";
import { type BinaryItemData } from "./types";

/** Returns the number of items matching the given group+index in the buffer. */
export const countItemType = (
  data: BinaryItemData,
  group: number,
  index: number,
): number => {
  const totalSlots = Math.floor(data.length / BYTES_PER_SLOT);
  let count = 0;

  for (let slot = 0; slot < totalSlots; slot++) {
    const offset = slot * BYTES_PER_SLOT;
    const b0 = data[offset];
    if (b0 === EMPTY_SLOT_BYTE) continue;

    const b9 = data[offset + 9];
    const itemType = b0 + ((b9 & ITEM_TYPE_EXTENDED_FLAG_MASK) !== 0 ? 256 : 0);
    const itemGroup = Math.floor(itemType / ITEM_TYPE_GROUP_SIZE);
    const itemIndex = itemType % ITEM_TYPE_GROUP_SIZE;

    if (itemGroup === group && itemIndex === index) {
      count++;
    }
  }

  return count;
};

/**
 * Clears the first `count` slots matching group+index from the buffer.
 * Returns a new Buffer. Throws if fewer than `count` matching items are found.
 */
export const removeItemsByType = (
  data: BinaryItemData,
  group: number,
  index: number,
  count: number,
): Buffer => {
  const buffer = Buffer.from(data);
  const totalSlots = Math.floor(buffer.length / BYTES_PER_SLOT);
  let removed = 0;

  for (let slot = 0; slot < totalSlots && removed < count; slot++) {
    const offset = slot * BYTES_PER_SLOT;
    const b0 = buffer[offset];
    if (b0 === EMPTY_SLOT_BYTE) continue;

    const b9 = buffer[offset + 9];
    const itemType = b0 + ((b9 & ITEM_TYPE_EXTENDED_FLAG_MASK) !== 0 ? 256 : 0);
    const itemGroup = Math.floor(itemType / ITEM_TYPE_GROUP_SIZE);
    const itemIndex = itemType % ITEM_TYPE_GROUP_SIZE;

    if (itemGroup === group && itemIndex === index) {
      buffer.fill(EMPTY_SLOT_BYTE, offset, offset + BYTES_PER_SLOT);
      removed++;
    }
  }

  if (removed < count) {
    throw new Error(
      `Only ${removed} item(s) found, but ${count} were requested.`,
    );
  }

  return buffer;
};

/**
 * Builds the 10 raw bytes for a fresh item (level 0, no skill/luck/excellent).
 * Sets the extended-type flag on byte 9 when the item type value exceeds 255.
 */
export const createFreshItemBytes = (
  group: number,
  index: number,
): number[] => {
  const itemType = group * ITEM_TYPE_GROUP_SIZE + index;
  const b0 = itemType > 255 ? itemType - 256 : itemType;
  const b9 = itemType > 255 ? ITEM_TYPE_EXTENDED_FLAG_MASK : 0x00;
  // bytes: type, level/flags, durability, serial(4), padding, excellent, padding, ext-flag
  return [b0, 0x00, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, b9];
};
