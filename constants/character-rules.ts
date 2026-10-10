import { serverConfig } from "@/lib/game/server-config";

/** Attributes supported by the current 0.97d Character database schema. */
export const ALLOCATABLE_STATS = ["str", "agi", "vit", "ene"] as const;
export const STAT_LABELS = {
  str: "Strength",
  agi: "Agility",
  vit: "Vitality",
  ene: "Energy",
} as const;

export const BASE_CLASS_BY_SUBCLASS: Record<number, number> = {
  1: 0,
  17: 16,
  33: 32,
};
export const EQUIPMENT_SLOT_COUNT = 12;
/** Neutral PK state matches the Character table and seed data. */
export const NEUTRAL_PK_LEVEL = 3;
/** Zen charged per PK kill to clear a Player Killer status, as /pkclear does in game. */
export const PK_CLEAR_COST_PER_KILL = serverConfig.pkClear.moneyPerKill;
