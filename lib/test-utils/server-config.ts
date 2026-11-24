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
  questWindow: [
    {
      index: 10,
      name: "Slay 50 Spiders",
      requirements: [
        {
          classes: ["dw", "dk", "fe"],
          quest: null,
          classChange: true,
          minLevel: null,
          maxLevel: null,
          resets: null,
        },
        {
          classes: ["mg"],
          quest: null,
          classChange: false,
          minLevel: null,
          maxLevel: null,
          resets: 1,
        },
      ],
      objectives: [
        { kind: "kill", monster: 3, name: "Spider", count: 50, maps: [0] },
      ],
      rewards: [
        { kind: "zen", value: 10_000_000, classes: ["dw", "dk", "fe", "mg"] },
      ],
    },
    {
      index: 11,
      name: "Slay 50 Budge Dragons",
      requirements: [
        {
          classes: ["dw", "dk", "fe", "mg"],
          quest: 10,
          classChange: false,
          minLevel: null,
          maxLevel: null,
          resets: null,
        },
      ],
      objectives: [
        {
          kind: "kill",
          monster: 2,
          name: "Budge Dragon",
          count: 50,
          maps: [0],
        },
      ],
      rewards: [
        {
          kind: "item",
          value: 3,
          item: {
            index: 459,
            level: 3,
            skill: false,
            luck: false,
            option: 0,
            excellent: 0,
          },
          classes: ["dw", "dk", "fe", "mg"],
        },
        { kind: "points", value: 5, classes: ["dw", "dk", "fe", "mg"] },
      ],
    },
  ],
  events: {
    bloodCastle: [0, 12],
    devilSquare: [0.5, 12.5],
    list: [
      {
        id: "bonus-0",
        name: "Happy Hour",
        enabled: true,
        durationMinutes: 60,
        schedule: [{ dayOfWeek: null, hour: 20, minute: 0 }],
        bonuses: [{ type: "experience", value: 150 }],
      },
    ],
  },
  maps: { "0": "Lorencia" },
  warehouse: { maxMoney: 2_000_000_000 },
  pkClear: { moneyPerKill: 15_000_000 },
  account: { md5Encryption: 1 },
  party: {
    maxDistance: 10,
    experience: {
      oneClass: [50, 125, 150, 175, 200],
      mixedClasses: [70, 140, 180, 200, 230],
    },
  },
};
