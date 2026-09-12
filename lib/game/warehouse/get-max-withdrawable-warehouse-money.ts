import { MAX_WAREHOUSE_MONEY } from "@/lib/game/constants/warehouse";

/** Zen that can be withdrawn without exceeding warehouse.Money's UnsignedInt cap. */
export const getMaxWithdrawableWarehouseMoney = (
  depositedCount: number,
  warehouseMoney: number,
): number =>
  Math.max(0, Math.min(depositedCount, MAX_WAREHOUSE_MONEY - warehouseMoney));
