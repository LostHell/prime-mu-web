import { CharacterClass } from "@/lib/types/character";

export const UNKNOWN_CHARACTER_CLASS = "Unknown";

export const CHARACTER_CLASS_BY_ID: Record<number, CharacterClass> = {
  0: "Dark Wizard",
  1: "Soul Master",
  16: "Dark Knight",
  17: "Blade Knight",
  32: "Fairy Elf",
  33: "Muse Elf",
  48: "Magic Gladiator",
};

/** Classes a new character can start as. The other entries are their evolutions. */
export const BASE_CHARACTER_CLASSES = [
  CHARACTER_CLASS_BY_ID[0],
  CHARACTER_CLASS_BY_ID[16],
  CHARACTER_CLASS_BY_ID[32],
  CHARACTER_CLASS_BY_ID[48],
] as const;
