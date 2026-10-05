import { getMaxObtainablePoints, getMaxStatPoint } from "./stat-limits";
import { serverConfig } from "@/lib/game/server-config";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

// Test config: 3 resets worth 400 points, max level 300, quests 0 and 1 worth
// 10 each for DW/DK/FE only. Fruits at level 300: 85 (DW), 70 (MG).

/** Runs `check` with a temporary change to the test config. */
const withCharacterConfig = (
  change: Partial<typeof serverConfig.character>,
  check: () => void,
) => {
  const original = { ...serverConfig.character };
  Object.assign(serverConfig.character, change);
  try {
    check();
  } finally {
    Object.assign(serverConfig.character, original);
  }
};

test("counts resets, levels, the class's quests and fruits", () => {
  expect(getMaxObtainablePoints(0)).toBe(400 + 299 * 5 + 20 + 85);
  expect(getMaxObtainablePoints(1)).toBe(getMaxObtainablePoints(0));
});

test("leaves out the rewards of quests the class can't take", () => {
  expect(getMaxObtainablePoints(48)).toBe(400 + 299 * 7 + 70);
});

test("adds the level 220 bonus only when the server has a HERO quest reward", () => {
  const withoutBonus = getMaxObtainablePoints(0)!;
  withCharacterConfig({ heroLevelBonus: true }, () => {
    expect(getMaxObtainablePoints(0)).toBe(withoutBonus + (300 - 220) * 1);
  });
});

test("limits a stat to its starting value plus every obtainable point", () => {
  expect(getMaxStatPoint(0, "ene")).toBe(30 + getMaxObtainablePoints(0)!);
  expect(getMaxStatPoint(16, "str")).toBe(28 + getMaxObtainablePoints(16)!);
});

test("falls back to the server's MaxStatPoint for unknown classes", () => {
  expect(getMaxObtainablePoints(444)).toBeNull();
  expect(getMaxStatPoint(444, "str")).toBe(serverConfig.character.maxStatPoint);
});

test("never goes above the server's MaxStatPoint", () => {
  withCharacterConfig({ maxStatPoint: 1_000 }, () => {
    expect(getMaxStatPoint(0, "str")).toBe(1_000);
  });
});
