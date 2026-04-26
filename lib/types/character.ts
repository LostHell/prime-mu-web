export type CharacterClass =
  | "Dark Knight"
  | "Blade Knight"
  | "Dark Wizard"
  | "Soul Master"
  | "Fairy Elf"
  | "Muse Elf"
  | "Magic Gladiator"
  | "Dark Lord";

export interface CharacterStats {
  str: number;
  agi: number;
  vit: number;
  ene: number;
  cmd: number;
}

export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  resets: number;
  guild?: string;
  zen: number;
  pkCount: number;
  freePoints: number;
  stats: CharacterStats;
}

export const CMD_CLASSES: CharacterClass[] = ["Dark Lord"];
