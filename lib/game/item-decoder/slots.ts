import { BYTES_PER_SLOT, EMPTY_SLOT_BYTE } from "./constants";
import { type BinaryItemData } from "./types";

export const clearWarehouseSlot = (
  data: BinaryItemData,
  slot: number,
): Buffer => {
  const buffer = Buffer.from(data);
  const offset = slot * BYTES_PER_SLOT;
  buffer.fill(EMPTY_SLOT_BYTE, offset, offset + BYTES_PER_SLOT);
  return buffer;
};

export const writeItemToSlot = (
  data: BinaryItemData,
  slot: number,
  itemBytes: BinaryItemData,
): Buffer => {
  const buffer = Buffer.from(data);
  const offset = slot * BYTES_PER_SLOT;
  for (let i = 0; i < BYTES_PER_SLOT && i < itemBytes.length; i++) {
    buffer[offset + i] = itemBytes[i];
  }
  return buffer;
};
