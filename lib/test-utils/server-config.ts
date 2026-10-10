import { type ServerConfig } from "@/lib/game/server-config";

/**
 * Fixed server settings for tests, so synced server changes don't break them.
 * Use with:
 *   jest.mock("@/lib/game/server-config", () =>
 *     jest.requireActual("@/lib/test-utils/server-config"),
 *   );
 */
export const serverConfig: ServerConfig = {
  server: { maxOnline: 100, experienceRate: 10, itemDropRate: 20 },
  character: {
    maxLevel: 300,
    maxStatPoint: 32_767,
    levelUpPoints: { dw: 5, dk: 5, fe: 5, mg: 7 },
    plusStatPoint: 1,
    defaultStats: {
      dw: { str: 18, agi: 18, vit: 15, ene: 30 },
      dk: { str: 28, agi: 20, vit: 25, ene: 10 },
      fe: { str: 22, agi: 25, vit: 20, ene: 15 },
      mg: { str: 26, agi: 26, vit: 26, ene: 26 },
    },
    quests: {
      "0": { rewardPoints: 10, classes: ["dw", "dk", "fe"] },
      "1": { rewardPoints: 10, classes: ["dw", "dk", "fe"] },
      "2": { rewardPoints: 0, classes: ["dw", "dk", "fe", "mg"] },
    },
    heroLevelBonus: false,
  },
  reset: {
    limit: 3,
    table: [
      { reset: 1, level: 300, money: 1_000, points: 100 },
      { reset: 2, level: 300, money: 2_000, points: 100 },
      { reset: 3, level: 300, money: 3_000, points: 200 },
    ],
  },
  events: { bloodCastle: [0, 12], devilSquare: [0.5, 12.5] },
  maps: { "0": "Lorencia" },
  warehouse: { maxMoney: 2_000_000_000 },
  pkClear: { moneyPerKill: 15_000_000 },
};
