import { getNextResetRule, getResetPoints } from "./reset";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

test("finds the next reset by its reset number", () => {
  expect(getNextResetRule(0)).toEqual({
    reset: 1,
    level: 300,
    money: 1_000,
    points: 100,
  });
  expect(getNextResetRule(2)).toMatchObject({ reset: 3, money: 3_000 });
  expect(getNextResetRule(3)).toBeNull();
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
