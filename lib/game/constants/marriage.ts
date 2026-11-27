/**
 * The marriage system's figures. They are not in the synced server config: they are the "Marriage
 * Settings" of the GameServer's GameServerInfo - Common.dat (MarriageExperience, MarriageMoney,
 * MarriageRequestTime, MarriageDivorcePenaltyDays) and its MAX_PARTY_DISTANCE, so keep them in step
 * by hand when those change.
 */
export const MARRIAGE = {
  /** 100 + the bonus (in % of its own experience alone) each of a couple near a kill gets outside a party. */
  experiencePercent: 130,
  /** Added to the party's experience rate for the two of them when they are in one party. */
  partyBonusPercent: 30,
  /** The zen each of them pays on her yes, with an excellent Ring of Ice or Ring of Poison. */
  money: 50_000_000,
  /** How long she has to answer a proposal. */
  answerSeconds: 60,
  /** How long the one who used /divorce has to wait to marry again. */
  divorceWaitDays: 7,
  /** Fewer steps than this between the two to marry, and between each of them and the monster. */
  maxDistance: 10,
} as const;
