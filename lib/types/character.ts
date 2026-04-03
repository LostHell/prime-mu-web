export type MuClass = "Dark Knight" | "Dark Wizard" | "Fairy Elf" | "Magic Gladiator" | "Dark Lord";

export interface CharacterStats {
  str: number;
  agi: number;
  vit: number;
  ene: number;
  cmd: number;
}

export interface Character {
  name: string;
  class: MuClass;
  level: number;
  resets: number;
  guild?: string;
  zen: number;
  pkCount: number;
  freePoints: number;
  stats: CharacterStats;
}

export const MU_CLASS_BY_ID: Record<number, MuClass> = {
  0: "Dark Wizard",
  1: "Dark Wizard",
  16: "Dark Knight",
  17: "Dark Knight",
  32: "Fairy Elf",
  33: "Fairy Elf",
  48: "Magic Gladiator",
  444: "Dark Lord",
};

export const CLASS_COLOR: Record<MuClass, string> = {
  "Dark Knight": "hsl(0 70% 55%)",
  "Dark Wizard": "hsl(220 80% 65%)",
  "Fairy Elf": "hsl(130 60% 50%)",
  "Magic Gladiator": "hsl(270 70% 65%)",
  "Dark Lord": "hsl(45 90% 55%)",
};

export const CMD_CLASSES: MuClass[] = ["Dark Lord"];
