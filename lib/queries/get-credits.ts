import "server-only";

import { prisma } from "@/prisma/prisma";

/**
 * The account's credits (AFK_CreditReward.Credits): earned AFK in game,
 * spent and earned on the market. 0 for an account without a row yet.
 */
export async function getAccountCredits(accountId: string): Promise<number> {
  const row = await prisma.aFK_CreditReward.findUnique({
    where: { AccountID: accountId },
    select: { Credits: true },
  });
  return row?.Credits ?? 0;
}
