import { BASE_CLASS_BY_SUBCLASS } from "@/constants/character-rules";
import { type ServerConfig } from "@/lib/game/server-config";

export type ClassKey = keyof ServerConfig["character"]["levelUpPoints"];

const CLASS_KEY_BY_BASE_CLASS: Record<number, ClassKey> = {
  0: "dw",
  16: "dk",
  32: "fe",
  48: "mg",
};

export const getBaseClass = (classId: number) =>
  BASE_CLASS_BY_SUBCLASS[classId] ?? classId;

/** Server config key for a class, or null when this server has no such class. */
export const getClassKey = (classId: number): ClassKey | null =>
  CLASS_KEY_BY_BASE_CLASS[getBaseClass(classId)] ?? null;
