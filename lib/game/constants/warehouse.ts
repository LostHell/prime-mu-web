import { serverConfig } from "@/lib/game/server-config";

export const WAREHOUSE_COLS = 8;
export const WAREHOUSE_ROWS = 15;
export const WAREHOUSE_SLOTS = WAREHOUSE_COLS * WAREHOUSE_ROWS;
export const EMPTY_SLOT_BG = "/images/warehouse/emptyslotbg.jpg";
export const FILLED_SLOT_BG = "/images/warehouse/filledslotbg.jpg";
/** Synced from the game server's Warehouse.h (MAX_WAREHOUSE_MONEY). */
export const MAX_WAREHOUSE_MONEY = serverConfig.warehouse.maxMoney;
