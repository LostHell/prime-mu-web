import { PK_CLEAR_COST_PER_KILL } from "@/constants/character-rules";

/** Zen needed to clear a character's PK status: a fixed price per PK kill. */
export const getPkClearCost = (pkCount: number): number =>
  Math.max(0, pkCount) * PK_CLEAR_COST_PER_KILL;

/**
 * Splits a cost between the character's own zen, used first, and the
 * account's deposited zen for whatever the character can't cover.
 */
export const splitPkClearPayment = (cost: number, characterZen: number) => {
  const fromCharacter = Math.min(cost, Math.max(0, characterZen));
  return { fromCharacter, fromDeposit: cost - fromCharacter };
};
