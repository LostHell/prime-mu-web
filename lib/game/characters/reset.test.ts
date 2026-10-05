import {
  getBaseClass,
  getEquipmentStatus,
  getQuestRewardPoints,
  getResetPoints,
  isQuestFinished,
} from "./reset";
import { EQUIPMENT_SLOT_COUNT } from "@/constants/character-rules";
import { BYTES_PER_SLOT } from "@/lib/game/item-decoder/constants";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

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

test("maps second classes to their base class", () => {
  expect(getBaseClass(17)).toBe(16);
  expect(getBaseClass(48)).toBe(48);
});

test("reads finished quests from the two-bit quest states", () => {
  // 0xFA = 11 11 10 10: quests 0 and 1 finished, 2 and 3 not started.
  const quest = Uint8Array.of(0xfa, 0xff);
  expect(isQuestFinished(quest, 0)).toBe(true);
  expect(isQuestFinished(quest, 1)).toBe(true);
  expect(isQuestFinished(quest, 2)).toBe(false);
  expect(isQuestFinished(quest, 8)).toBe(false);
  expect(isQuestFinished(null, 0)).toBe(false);
  expect(getQuestRewardPoints(quest)).toBe(20);
  // 0xF6 = 11 11 01 10: quest 0 finished, quest 1 only accepted.
  expect(getQuestRewardPoints(Uint8Array.of(0xf6))).toBe(10);
});

test("adds up each reset's points from the reset table", () => {
  // Test reset table: 100, 100, then 200 points.
  expect(getResetPoints({ resets: 0, quest: null, fruitAddPoint: 0 })).toBe(
    100,
  );
  expect(getResetPoints({ resets: 2, quest: null, fruitAddPoint: 0 })).toBe(
    400,
  );
});

test("keeps quest and fruit points on reset, like the game server", () => {
  expect(
    getResetPoints({
      resets: 1,
      quest: Uint8Array.of(0xfa),
      fruitAddPoint: 35,
    }),
  ).toBe(200 + 20 + 35);
});
