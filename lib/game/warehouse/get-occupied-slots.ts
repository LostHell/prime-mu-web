import { WarehouseItem } from "@/lib/queries/get-warehouse-items";
import { WAREHOUSE_COLS } from "./constants";

export const getOccupiedSlots = (items: WarehouseItem[]): Set<number> => {
  const set = new Set<number>();
  for (const item of items) {
    const startRow = Math.floor(item.slot / WAREHOUSE_COLS);
    const startCol = item.slot % WAREHOUSE_COLS;
    for (let dy = 0; dy < item.height; dy++) {
      for (let dx = 0; dx < item.width; dx++) {
        const row = startRow + dy;
        const col = startCol + dx;
        set.add(row * WAREHOUSE_COLS + col);
      }
    }
  }
  return set;
};