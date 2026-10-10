import { serverConfig } from "@/lib/game/server-config";

/** Quest state stored in the Character.Quest bitfield (GameServer Quest.h). */
const QUEST_STATE_FINISHED = 2;
const QUEST_STATES_PER_BYTE = 4;
const QUEST_STATE_BITS = 2;
const QUEST_STATE_MASK = 0b11;

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
