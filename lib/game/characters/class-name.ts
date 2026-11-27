import {
  CHARACTER_CLASS_BY_ID,
  CHARACTER_CLASS_SHORT_NAME,
  UNKNOWN_CHARACTER_CLASS,
} from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";

/** Display name for a class id. Missing or unmapped ids stay unknown. */
export const characterClassName = (
  classId: number | null | undefined,
): CharacterClass | typeof UNKNOWN_CHARACTER_CLASS => {
  if (classId == null) return UNKNOWN_CHARACTER_CLASS;
  return CHARACTER_CLASS_BY_ID[classId] ?? UNKNOWN_CHARACTER_CLASS;
};

/** The short name of a class display name (DW, BK, MG...); an unknown class keeps its name. */
export const characterClassShortName = (
  className: CharacterClass | typeof UNKNOWN_CHARACTER_CLASS,
): string =>
  className === UNKNOWN_CHARACTER_CLASS
    ? className
    : CHARACTER_CLASS_SHORT_NAME[className];
