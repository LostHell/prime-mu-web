import { type ALLOCATABLE_STATS } from "@/constants/character-rules";
import { serverConfig } from "@/lib/game/server-config";
import { getAccumulatedResetPoints, getBaseClass } from "./reset";

type AllocatableStat = (typeof ALLOCATABLE_STATS)[number];
type ClassKey = keyof typeof serverConfig.character.levelUpPoints;

const CLASS_KEY_BY_BASE_CLASS: Record<number, ClassKey> = {
  0: "dw",
  16: "dk",
  32: "fe",
  48: "mg",
};

/**
 * Rules that live in the GameServer code rather than its config: when the
 * server has a HERO quest reward, finishing quest 2 grants PlusStatPoint more
 * for each level above 220 (ObjectManager.cpp, QuestReward.cpp).
 */
const HERO_QUEST_INDEX = "2";
const HERO_LEVEL_BONUS_FROM_LEVEL = 220;

/** Highest fruit points at `level` (Fruit.cpp CFruit::Init). */
const getMaxFruitPoints = (classKey: ClassKey, level: number): number => {
  const divisor = classKey === "mg" ? 700 : 400;
  let points = 2;
  for (let n = 0; n < level; n++) {
    if ((n + 1) % 10 === 0) {
      points += Math.floor(((n + 11) * 3) / divisor) + 2;
    }
  }
  return points;
};

/**
 * Most free points a character of this class can collect: every reset,
 * levelling to the maximum level after the last one, rewards of the quests
 * the class can take, and fruits.
 */
export const getMaxObtainablePoints = (classId: number): number | null => {
  const classKey = CLASS_KEY_BY_BASE_CLASS[getBaseClass(classId)];
  if (!classKey) return null;

  const { maxLevel, levelUpPoints, plusStatPoint, quests, heroLevelBonus } =
    serverConfig.character;
  const canTakeQuest = (questIndex: string) =>
    quests[questIndex]?.classes.includes(classKey) ?? false;
  const questPoints = Object.entries(quests)
    .filter(([questIndex]) => canTakeQuest(questIndex))
    .reduce((total, [, { rewardPoints }]) => total + rewardPoints, 0);
  const heroPoints =
    heroLevelBonus && canTakeQuest(HERO_QUEST_INDEX)
      ? Math.max(0, maxLevel - HERO_LEVEL_BONUS_FROM_LEVEL) * plusStatPoint
      : 0;

  return (
    getAccumulatedResetPoints(serverConfig.reset.limit) +
    (maxLevel - 1) * levelUpPoints[classKey] +
    questPoints +
    heroPoints +
    getMaxFruitPoints(classKey, maxLevel)
  );
};

/**
 * Highest value a stat can legitimately reach: the class's starting value
 * plus every obtainable point, never above the server's MaxStatPoint.
 */
export const getMaxStatPoint = (
  classId: number,
  stat: AllocatableStat,
): number => {
  const { maxStatPoint, defaultStats } = serverConfig.character;
  const classKey = CLASS_KEY_BY_BASE_CLASS[getBaseClass(classId)];
  const obtainable = getMaxObtainablePoints(classId);
  if (!classKey || obtainable === null) return maxStatPoint;
  return Math.min(maxStatPoint, defaultStats[classKey][stat] + obtainable);
};
