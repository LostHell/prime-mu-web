import { PK_CLEAR_COST_PER_KILL } from "@/constants/character-rules";

/** Zen needed to clear a character's PK status: a fixed price per PK kill. */
export const getPkClearCost = (pkCount: number): number =>
  Math.max(0, pkCount) * PK_CLEAR_COST_PER_KILL;
