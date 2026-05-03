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
    const definition = getItemDefinition(item.group, item.index);
    const itemWidth = definition?.width ?? 1;
    const itemHeight = definition?.height ?? 1;

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

export const findFreeArea = (
  data: BinaryItemData,
  width: number,
  height: number,
): number => {
  const occupancyGrid = buildOccupancyGrid(data);

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
};
