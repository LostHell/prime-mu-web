import { type ResetRule, serverConfig } from "@/lib/game/server-config";
import { getQuestRewardPoints } from "./quests";

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
