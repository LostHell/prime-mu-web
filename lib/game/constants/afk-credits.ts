/**
 * Where a character earns AFK credits (AFK_CreditReward.Credits) and how fast: one credit every
 * `hoursPerCredit` hours online in the zone. They are not in the synced server config: the database
 * procedure ProcessZoneCreditRewards (prisma/create-db.sql, the server's CreateDatabase.sql), which
 * MySQL runs every minute, gives them. afk-credits.test.ts checks these against it.
 */
export const AFK_CREDIT_ZONES = [
  {
    /** The procedure's columns: DaviasNextRewardTime, ArenaNextRewardTime. */
    column: "Davias",
    name: "Davias town",
    hoursPerCredit: 1,
  },
  {
    column: "Arena",
    name: "the Arena",
    hoursPerCredit: 6,
  },
] as const;
