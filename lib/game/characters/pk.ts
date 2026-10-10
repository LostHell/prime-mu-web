import { serverConfig } from "@/lib/game/server-config";

/** Zen charged per PK kill to clear a Player Killer status, as /pkclear does in game. */
export const PK_CLEAR_COST_PER_KILL = serverConfig.pkClear.moneyPerKill;

/** Zen needed to clear a character's PK status: a fixed price per PK kill. */
export const getPkClearCost = (pkCount: number): number =>
  Math.max(0, pkCount) * PK_CLEAR_COST_PER_KILL;
