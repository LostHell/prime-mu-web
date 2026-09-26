import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  ITEM_ADD_OPTION_MASK,
  ITEM_EXCELLENT_MASK,
  ITEM_LEVEL_MASK,
  ITEM_LEVEL_SHIFT,
  ITEM_LUCK_MASK,
  ITEM_SKILL_MASK,
  ITEM_SERIAL_BYTES,
  ITEM_SERIAL_OFFSET,
  ITEM_TYPE_EXTENDED_FLAG_MASK,
  ITEM_TYPE_GROUP_SIZE,
  BYTE_RADIX,
} from "./constants";
import { type BinaryItemData, type DecodedItem } from "./types";

/** Reads the four-byte, big-endian item instance serial from a complete slot. */
export const getItemSerial = (data: BinaryItemData): number => {
  if (data.length < ITEM_SERIAL_OFFSET + ITEM_SERIAL_BYTES) {
    throw new RangeError(
      "Cannot read an item serial from incomplete item data.",
    );
  }

  return Array.from(
    data.subarray(ITEM_SERIAL_OFFSET, ITEM_SERIAL_OFFSET + ITEM_SERIAL_BYTES),
  ).reduce((serial, byte) => serial * BYTE_RADIX + byte, 0);
};

const parseItemAtSlot = (
  data: BinaryItemData,
  slot: number,
): DecodedItem | null => {
  const offset = slot * BYTES_PER_SLOT;
  const b0 = data[offset];

  if (b0 === EMPTY_SLOT_BYTE) {
    return null;
  }

  const b1 = data[offset + 1];
  const b2 = data[offset + 2];
  const b7 = data[offset + 7];

  const itemType = b0 + ((b7 & ITEM_TYPE_EXTENDED_FLAG_MASK) !== 0 ? 256 : 0);
  const group = Math.floor(itemType / ITEM_TYPE_GROUP_SIZE);
  const index = itemType % ITEM_TYPE_GROUP_SIZE;
  const skill = (b1 & ITEM_SKILL_MASK) !== 0;
  const luck = (b1 & ITEM_LUCK_MASK) !== 0;
  const addOption = (b1 & ITEM_ADD_OPTION_MASK) * 4;
  const durability = b2;
  const level = (b1 >> ITEM_LEVEL_SHIFT) & ITEM_LEVEL_MASK;
  const excellent = b7 & ITEM_EXCELLENT_MASK;
  const serial = getItemSerial(data.subarray(offset, offset + BYTES_PER_SLOT));

  return {
    slot,
    group,
    index,
    level,
    skill,
    luck,
    addOption,
    excellent,
    durability,
    serial,
    rawBytes: Array.from(data.subarray(offset, offset + BYTES_PER_SLOT)),
  };
};

export const decodeItems = (data: BinaryItemData): DecodedItem[] => {
  const decodedItems: DecodedItem[] = [];
  const totalSlots = Math.floor(data.length / BYTES_PER_SLOT);

  for (let slot = 0; slot < totalSlots; slot++) {
    const decodedItem = parseItemAtSlot(data, slot);
    if (decodedItem) {
      decodedItems.push(decodedItem);
    }
  }

  return decodedItems;
};

export const decodeItem = (data: BinaryItemData): DecodedItem | null => {
  if (data.length < BYTES_PER_SLOT) {
    return null;
  }

  return parseItemAtSlot(data, 0) ?? null;
};
