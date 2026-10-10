import { type ALLOCATABLE_STATS } from "@/constants/character-rules";
import { serverConfig } from "@/lib/game/server-config";
import { type ClassKey, getClassKey } from "./class";
import { getAccumulatedResetPoints } from "./reset";

type AllocatableStat = (typeof ALLOCATABLE_STATS)[number];

/**
 * Quest 2's HERO reward, from ObjectManager.cpp and QuestReward.cpp: when the
 * server has that reward, finishing the quest grants PlusStatPoint for each
 * level above 220.
 */
const QUEST_THAT_GRANTS_LEVEL_BONUS = "2";
const HERO_BONUS_STARTS_AFTER_LEVEL = 220;

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
  const classKey = getClassKey(classId);
  if (!classKey) return null;

  const { maxLevel, levelUpPoints, plusStatPoint, quests, heroLevelBonus } =
    serverConfig.character;
  const canTakeQuest = (questIndex: string) =>
    quests[questIndex]?.classes.includes(classKey) ?? false;
  const questRewardPoints = Object.entries(quests)
    .filter(([questIndex]) => canTakeQuest(questIndex))
    .reduce((total, [, { rewardPoints }]) => total + rewardPoints, 0);
  const pointsFromHeroQuest =
    heroLevelBonus && canTakeQuest(QUEST_THAT_GRANTS_LEVEL_BONUS)
      ? Math.max(0, maxLevel - HERO_BONUS_STARTS_AFTER_LEVEL) * plusStatPoint
      : 0;
  const resetPoints = getAccumulatedResetPoints(serverConfig.reset.limit);
  const pointsFromLastLevelClimb = (maxLevel - 1) * levelUpPoints[classKey];
  const fruitPoints = getMaxFruitPoints(classKey, maxLevel);

  return (
    resetPoints +
    pointsFromLastLevelClimb +
    questRewardPoints +
    pointsFromHeroQuest +
    fruitPoints
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
  const classKey = getClassKey(classId);
  const obtainable = getMaxObtainablePoints(classId);
  if (!classKey || obtainable === null) return maxStatPoint;
  return Math.min(maxStatPoint, defaultStats[classKey][stat] + obtainable);
};
