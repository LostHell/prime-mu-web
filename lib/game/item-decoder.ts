import { getItemDefinition } from "@/lib/game/item-database";
import { DecodedItem } from "@/lib/types/item";

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

export function clearWarehouseSlot(
  data: Buffer | Uint8Array,
  slot: number,
): Buffer {
  const buf = Buffer.from(data);
  const offset = slot * BYTES_PER_SLOT;
  buf.fill(0xff, offset, offset + BYTES_PER_SLOT);
  return buf;
}

export function writeItemToSlot(
  data: Buffer | Uint8Array,
  slot: number,
  itemBytes: number[],
): Buffer {
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

function buildOccupancyGrid(
  data: Buffer | Uint8Array,
  cols: number,
  rows: number,
): boolean[][] {
  const grid: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );

  const items = decodeWarehouseItems(data);

  for (const item of items) {
    const def = getItemDefinition(item.group, item.index);
    const itemWidth = def?.width ?? 1;
    const itemHeight = def?.height ?? 1;

    const startRow = Math.floor(item.slot / cols);
    const startCol = item.slot % cols;

    for (let h = 0; h < itemHeight; h++) {
      for (let w = 0; w < itemWidth; w++) {
        const row = startRow + h;
        const col = startCol + w;
        if (row < rows && col < cols) {
          grid[row][col] = true;
        }
      }
    }
  }

  return grid;
}

export function findFreeArea(
  data: Buffer | Uint8Array,
  width: number,
  height: number,
  cols: number = WAREHOUSE_COLS,
): number {
  const totalSlots = Math.floor(data.length / BYTES_PER_SLOT);
  const rows = Math.floor(totalSlots / cols);

  const occupancyGrid = buildOccupancyGrid(data, cols, rows);

  for (let row = 0; row <= rows - height; row++) {
    for (let col = 0; col <= cols - width; col++) {
      let fits = true;

      for (let h = 0; h < height && fits; h++) {
        for (let w = 0; w < width && fits; w++) {
          if (occupancyGrid[row + h][col + w]) {
            fits = false;
          }
        }
      }

      if (fits) {
        return row * cols + col;
      }
    }
  }

  return -1;
}
