import { getQuestRewardPoints, isQuestFinished } from "./quests";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

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
