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
