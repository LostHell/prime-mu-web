import { EQUIPMENT_SLOT_COUNT } from "@/constants/character-rules";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
} from "@/lib/game/item-decoder/constants";

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
