import { getBaseClass, getEquipmentStatus, getResetPoints } from "./reset";
import { POINTS_PER_RESET } from "@/constants/resets";
import { EQUIPMENT_SLOT_COUNT } from "@/constants/character-rules";
import { BYTES_PER_SLOT } from "@/lib/game/item-decoder/constants";

test("does not mistake unavailable or truncated inventory for unequipped gear", () => {
  expect(getEquipmentStatus(null)).toBe("unknown");
  expect(getEquipmentStatus(new Uint8Array(10).fill(255))).toBe("unknown");
  const inventory = new Uint8Array(EQUIPMENT_SLOT_COUNT * BYTES_PER_SLOT).fill(
    255,
  );
  expect(getEquipmentStatus(inventory)).toBe("empty");
  inventory[0] = 0;
  expect(getEquipmentStatus(inventory)).toBe("equipped");
});

test("includes accumulated resets and class base points in the preview", () => {
  expect(getResetPoints(4, 25)).toBe(25 + 5 * POINTS_PER_RESET);
  expect(getBaseClass(17)).toBe(16);
  expect(getBaseClass(48)).toBe(48);
});
