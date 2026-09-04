import {
  ITEM_LEVEL_MASK,
  ITEM_LEVEL_SHIFT,
  ITEM_TYPE_EXTENDED_FLAG_MASK,
  ITEM_TYPE_GROUP_SIZE,
} from "./constants";

/**
 * Builds the 10 raw bytes for a new item instance at the given level (no
 * skill/luck/excellent/serial). Sets the extended-type flag on byte 9 when
 * the item type value exceeds 255.
 */
export const createItemBytes = (
  group: number,
  index: number,
  level: number,
): number[] => {
  const itemType = group * ITEM_TYPE_GROUP_SIZE + index;
  const b0 = itemType > 255 ? itemType - 256 : itemType;
  const b1 = (level & ITEM_LEVEL_MASK) << ITEM_LEVEL_SHIFT;
  const b9 = itemType > 255 ? ITEM_TYPE_EXTENDED_FLAG_MASK : 0x00;
  // bytes: type, level/flags, durability, serial(4), padding, excellent, padding, ext-flag
  return [b0, b1, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, b9];
};
