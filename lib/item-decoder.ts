import { DecodedItem } from "@/types/item";

export const WAREHOUSE_COLS = 8;
export const BYTES_PER_SLOT = 10;
export const EXT_WAREHOUSE_ROWS = 15;
export const EXT_WAREHOUSE_SLOTS = WAREHOUSE_COLS * EXT_WAREHOUSE_ROWS;

export function decodeWarehouseItems(data: Buffer | Uint8Array): DecodedItem[] {
  const items: DecodedItem[] = [];
  const totalSlots = Math.floor(data.length / BYTES_PER_SLOT);

  for (let slot = 0; slot < totalSlots; slot++) {
    const offset = slot * BYTES_PER_SLOT;
    const b0 = data[offset];

    if (b0 === 0xff) continue;

    const b1 = data[offset + 1];
    const b2 = data[offset + 2];
    const b7 = data[offset + 7];
    const b9 = data[offset + 9];

    const itemType = b0 + ((b9 & 0x08) !== 0 ? 256 : 0);
    const group = Math.floor(itemType / 32);
    const index = itemType % 32;
    const skill = (b1 & 0x80) !== 0;
    const luck = (b1 & 0x04) !== 0;
    const addOption = (b1 & 0x03) * 4;
    const durability = b2;
    const level = (b1 >> 3) & 0x0f;
    const excellent = b7 & 0x3f;

    items.push({
      slot,
      group,
      index,
      level,
      skill,
      luck,
      addOption,
      excellent,
      durability,
      rawBytes: Array.from(data.slice(offset, offset + BYTES_PER_SLOT)),
    });
  }

  return items;
}

export function clearWarehouseSlot(data: Buffer | Uint8Array, slot: number): Buffer {
  const buf = Buffer.from(data);
  const offset = slot * BYTES_PER_SLOT;
  buf.fill(0xff, offset, offset + BYTES_PER_SLOT);
  return buf;
}

export function writeItemToSlot(data: Buffer | Uint8Array, slot: number, itemBytes: number[]): Buffer {
  const buf = Buffer.from(data);
  const offset = slot * BYTES_PER_SLOT;
  for (let i = 0; i < BYTES_PER_SLOT && i < itemBytes.length; i++) {
    buf[offset + i] = itemBytes[i];
  }
  return buf;
}

export function findFreeSlot(data: Buffer | Uint8Array, startSlot = 0): number {
  const totalSlots = Math.floor(data.length / BYTES_PER_SLOT);
  for (let slot = startSlot; slot < totalSlots; slot++) {
    if (data[slot * BYTES_PER_SLOT] === 0xff) return slot;
  }
  return -1;
}
