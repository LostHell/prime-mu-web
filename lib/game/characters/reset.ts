import {
  BASE_CLASS_BY_SUBCLASS,
  EQUIPMENT_SLOT_COUNT,
} from "@/constants/character-rules";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
} from "@/lib/game/item-decoder/constants";
import { type ResetRule, serverConfig } from "@/lib/game/server-config";

/** Quest state stored in the Character.Quest bitfield (GameServer Quest.h). */
const QUEST_STATE_FINISHED = 2;
const QUEST_STATES_PER_BYTE = 4;
const QUEST_STATE_BITS = 2;
const QUEST_STATE_MASK = 0b11;

export const getBaseClass = (classId: number) =>
  BASE_CLASS_BY_SUBCLASS[classId] ?? classId;

export const isQuestFinished = (
  quest: Uint8Array | null | undefined,
  questIndex: number,
): boolean => {
  const byte = quest?.[Math.floor(questIndex / QUEST_STATES_PER_BYTE)];
  if (byte === undefined) return false;
  const shift = (questIndex % QUEST_STATES_PER_BYTE) * QUEST_STATE_BITS;
  return ((byte >> shift) & QUEST_STATE_MASK) === QUEST_STATE_FINISHED;
};

export const getQuestRewardPoints = (
  quest: Uint8Array | null | undefined,
): number =>
  Object.entries(serverConfig.character.quests).reduce(
    (total, [questIndex, { rewardPoints }]) =>
      isQuestFinished(quest, Number(questIndex)) ? total + rewardPoints : total,
    0,
  );

/** Points granted by the first `resets` resets (ResetTable.cpp GetResetPoint). */
export const getAccumulatedResetPoints = (resets: number): number =>
  serverConfig.reset.table
    .filter((rule) => rule.reset <= resets)
    .reduce((total, rule) => total + rule.points, 0);

/** Requirements and reward of the next reset after `resets` completed ones. */
export const getNextResetRule = (resets: number): ResetRule | null =>
  serverConfig.reset.table.find((rule) => rule.reset === resets + 1) ?? null;

type ResetPointsInput = {
  /** Resets before this one. */
  resets: number;
  quest: Uint8Array | null | undefined;
  fruitAddPoint: number;
};

/**
 * Free points after a reset, as the GameServer's /reset computes them
 * (CommandManager.cpp): points for every reset, plus level-up points from
 * finished quests and fruits, which a reset keeps.
 */
export const getResetPoints = ({
  resets,
  quest,
  fruitAddPoint,
}: ResetPointsInput): number =>
  getAccumulatedResetPoints(resets + 1) +
  getQuestRewardPoints(quest) +
  fruitAddPoint;

export function getEquipmentStatus(
  inventory: Uint8Array | null | undefined,
): "empty" | "equipped" | "unknown" {
  const equipmentBytes = EQUIPMENT_SLOT_COUNT * BYTES_PER_SLOT;
  if (!inventory || inventory.length < equipmentBytes) return "unknown";
  return inventory
    .subarray(0, equipmentBytes)
    .every((byte) => byte === EMPTY_SLOT_BYTE)
    ? "empty"
    : "equipped";
}
