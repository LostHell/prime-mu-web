import {
  ITEM_LEVEL_MASK,
  ITEM_LEVEL_SHIFT,
  ITEM_TYPE_EXTENDED_FLAG_MASK,
  ITEM_TYPE_GROUP_SIZE,
} from "./constants";

/** 10-byte item instance. Serial must be non-zero; durability is 1 (jewels). */
export const createItemBytes = (
  group: number,
  index: number,
  level: number,
  serial: number,
): number[] => {
  const itemType = group * ITEM_TYPE_GROUP_SIZE + index;
  const extended = itemType > 255;

  return [
    extended ? itemType - 256 : itemType,
    (level & ITEM_LEVEL_MASK) << ITEM_LEVEL_SHIFT,
    1,
    (serial >>> 24) & 0xff,
    (serial >>> 16) & 0xff,
    (serial >>> 8) & 0xff,
    serial & 0xff,
    0x00,
    0x00,
    extended ? ITEM_TYPE_EXTENDED_FLAG_MASK : 0x00,
  ];
};
