import type { QuestWindowQuest } from "@/lib/game/server-config";
import { describeQuestWindow } from "./describe-quest-window";

const ALL = ["dw", "dk", "fe", "mg"];
const MAPS = { 0: "Lorencia", 1: "Dungeon", 3: "Noria" };
const ITEM_NAMES: Record<string, string> = {
  "399:0": "Jewel of Chaos",
  "459:8": "Box of Kundun +1",
  "461:0": "Jewel of Bless",
};
const itemName = ({ index, level }: { index: number; level: number }) =>
  ITEM_NAMES[`${index}:${level}`] ?? "Unknown item";

const quest = (
  index: number,
  overrides: Partial<QuestWindowQuest> = {},
): QuestWindowQuest => ({
  index,
  name: `Quest ${index}`,
  requirements: [
    {
      classes: ALL,
      quest: index - 1,
      classChange: false,
      minLevel: null,
      maxLevel: null,
      resets: null,
    },
  ],
  objectives: [],
  rewards: [],
  ...overrides,
});

test("numbers the quests as the game's window does and refers to the one before by that number", () => {
  const [group] = describeQuestWindow([quest(10), quest(11)], MAPS, itemName);

  expect(group.quests.map((q) => q.number)).toEqual([1, 2]);
  expect(group.quests[1].requirement).toBe("After quest 1");
});

test("describes the first quest's class change and reset requirement by class", () => {
  const [group] = describeQuestWindow(
    [
      quest(10, {
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
      }),
    ],
    MAPS,
    itemName,
  );

  expect(group.quests[0].requirement).toBe(
    "After the class change (Dark Wizard, Dark Knight, Fairy Elf) or with 1 reset (Magic Gladiator)",
  );
});

test("joins requirement rows that differ only by class and names the levels", () => {
  const row = {
    quest: null,
    classChange: false,
    minLevel: 150,
    maxLevel: 400,
    resets: 2,
  };
  const [group] = describeQuestWindow(
    [
      quest(10, {
        requirements: [
          { ...row, classes: ["dw", "dk"] },
          { ...row, classes: ["fe", "mg"] },
        ],
      }),
      quest(11, { requirements: [] }),
    ],
    MAPS,
    itemName,
  );

  expect(group.quests[0].requirement).toBe(
    "With 2 resets, from level 150, up to level 400",
  );
  expect(group.quests[1].requirement).toBe("Open from the start");
});

test("lists the monsters to slay with the maps they live on", () => {
  const [group] = describeQuestWindow(
    [
      quest(10, {
        objectives: [
          { kind: "kill", monster: 3, name: "Spider", count: 50, maps: [0] },
          {
            kind: "kill",
            monster: 14,
            name: "Skeleton",
            count: 100,
            maps: [0, 1, 99],
          },
          { kind: "kill", monster: 7, name: "Giant", count: 1, maps: [] },
          { kind: "item", item: 399, level: 0, count: 2 },
          { kind: "zen", value: 1_000_000 },
        ],
      }),
    ],
    MAPS,
    itemName,
  );

  expect(group.quests[0].objectives).toEqual([
    { text: "50 × Spider", where: "Lorencia" },
    { text: "100 × Skeleton", where: "Lorencia, Dungeon" },
    { text: "1 × Giant", where: null },
    { text: "2 × Jewel of Chaos", where: null },
    { text: "1,000,000 zen", where: null },
  ]);
});

test("lists the rewards: zen, items by name and count, points, by class and one of a group", () => {
  const item = (index: number, level = 0) => ({
    index,
    level,
    skill: false,
    luck: false,
    option: 0,
    excellent: 0,
  });
  const [group] = describeQuestWindow(
    [
      quest(10, {
        rewards: [
          { kind: "zen", value: 10_000_000, classes: ALL },
          { kind: "item", value: 1, item: item(459, 8), classes: ALL },
          { kind: "item", value: 3, item: item(461), classes: ALL },
          { kind: "points", value: 1, classes: ALL },
          { kind: "points", value: 5, classes: ["mg"] },
          {
            kind: "item",
            value: 1,
            item: { ...item(399), luck: true, option: 2, excellent: 1 },
            classes: ALL,
          },
          { kind: "item", value: 1, item: item(399), group: 4, classes: ALL },
          { kind: "item", value: 2, item: item(461), group: 4, classes: ALL },
        ],
      }),
    ],
    MAPS,
    itemName,
  );

  expect(group.quests[0].rewards).toEqual([
    "10,000,000 zen",
    "Box of Kundun +1",
    "3 × Jewel of Bless",
    "1 level-up point",
    "5 level-up points (Magic Gladiator)",
    "Jewel of Chaos (Luck, +8 option, Excellent)",
    "One of: Jewel of Chaos, 2 × Jewel of Bless",
  ]);
});

test("puts the quests in blocks of ten, the last block holding the rest", () => {
  const quests = Array.from({ length: 21 }, (_, i) => quest(10 + i));

  const groups = describeQuestWindow(quests, MAPS, itemName);

  expect(groups.map((group) => group.title)).toEqual([
    "Quests 1–10",
    "Quests 11–20",
    "Quest 21",
  ]);
  expect(groups[1].quests).toHaveLength(10);
});

test("has no blocks when the window has no quests", () => {
  expect(describeQuestWindow([], MAPS, itemName)).toEqual([]);
});
