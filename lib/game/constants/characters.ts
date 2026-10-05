import { CharacterClass } from "@/lib/types/character";

export const CHARACTER_CLASS_BY_ID: Record<number, CharacterClass> = {
  0: "Dark Wizard",
  1: "Soul Master",
  16: "Dark Knight",
  17: "Blade Knight",
  32: "Fairy Elf",
  33: "Muse Elf",
  48: "Magic Gladiator",
  444: "Dark Lord",
};

export const CHARACTER_CLASS_ID_BY_NAME = Object.fromEntries(
  Object.entries(CHARACTER_CLASS_BY_ID).map(([id, name]) => [name, Number(id)]),
) as Record<CharacterClass, number>;
