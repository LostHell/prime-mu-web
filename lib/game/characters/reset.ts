import {
  BASE_CLASS_BY_SUBCLASS,
  EQUIPMENT_SLOT_COUNT,
} from "@/constants/character-rules";
import { POINTS_PER_RESET } from "@/constants/resets";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
} from "@/lib/game/item-decoder/constants";

export const getBaseClass = (classId: number) =>
  BASE_CLASS_BY_SUBCLASS[classId] ?? classId;
export const getResetPoints = (resets: number, basePoints: number) =>
  basePoints + (resets + 1) * POINTS_PER_RESET;

export function getEquipmentStatus(
  inventory: Uint8Array | null | undefined,
): "empty" | "equipped" | "unknown" {
  const equipmentBytes = EQUIPMENT_SLOT_COUNT * BYTES_PER_SLOT;
  if (!inventory || inventory.length < equipmentBytes) return "unknown";
  return inventory
    .subarray(0, equipmentBytes)
    .every((byte) => byte === EMPTY_SLOT_BYTE)
    ? "empty"
    : "equipped";
}
