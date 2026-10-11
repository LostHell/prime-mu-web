import {
  CHARACTER_CLASS_BY_ID,
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
