import { WAREHOUSE_COLS, WAREHOUSE_ROWS } from "@/lib/game/constants/warehouse";
import { getItemDefinition } from "@/lib/game/item-database";
import { decodeItems } from "./decode";
import { type BinaryItemData } from "./types";

const cols = WAREHOUSE_COLS;
const rows = WAREHOUSE_ROWS;

const buildOccupancyGrid = (data: BinaryItemData): boolean[][] => {
  const grid: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );

  const items = decodeItems(data);

  for (const item of items) {
    const itemDef = getItemDefinition({
      group: item.group,
      index: item.index,
      level: item.level,
    });
    const itemWidth = itemDef?.width ?? 1;
    const itemHeight = itemDef?.height ?? 1;

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
};

/**
 * Finds up to `count` free areas of the given size, in row-major order.
 * Each returned slot is marked as occupied before searching for the next one,
 * so the returned slots never overlap. May return fewer than `count` slots
 * if the warehouse doesn't have enough room.
 */
export const findFreeAreas = (
  data: BinaryItemData,
  width: number,
  height: number,
  count: number,
): number[] => {
  const occupancyGrid = buildOccupancyGrid(data);
  const slots: number[] = [];

  for (let row = 0; row <= rows - height && slots.length < count; row++) {
    for (let col = 0; col <= cols - width && slots.length < count; col++) {
      let fits = true;

      for (let h = 0; h < height && fits; h++) {
        for (let w = 0; w < width && fits; w++) {
          if (occupancyGrid[row + h][col + w]) {
            fits = false;
          }
        }
      }

      if (fits) {
        slots.push(row * cols + col);
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            occupancyGrid[row + h][col + w] = true;
          }
        }
      }
    }
  }

  return slots;
};

export const findFreeArea = (
  data: BinaryItemData,
  width: number,
  height: number,
): number => {
  const [firstFreeArea] = findFreeAreas(data, width, height, 1);

  return firstFreeArea ?? -1;
};
