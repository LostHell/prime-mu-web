import "server-only";

import { prisma } from "@/prisma/prisma";

/** Account ids whose ConnectStat says they are in the game. */
export async function getOnlineAccountIds(): Promise<string[]> {
  const onlineAccounts = await prisma.mEMB_STAT.findMany({
    where: { ConnectStat: { not: 0 } },
    select: { memb___id: true },
  });
  return onlineAccounts.map((row) => row.memb___id);
}

/**
 * Character names currently in the game: AccountCharacter.GameIDC for a
 * connected account. Other characters on that account are not included.
 */
export async function getCharactersInGame(): Promise<string[]> {
  const accountIds = await getOnlineAccountIds();
  if (accountIds.length === 0) return [];

  const slots = await prisma.accountCharacter.findMany({
    where: { Id: { in: accountIds }, GameIDC: { not: null } },
    select: { GameIDC: true },
  });
  return slots.flatMap((row) => (row.GameIDC ? [row.GameIDC] : []));
}

/** Which of `names` are the character currently in the game. */
export async function getOnlineCharacterNames(
  names: string[],
): Promise<Set<string>> {
  if (names.length === 0) return new Set();

  const slots = await prisma.accountCharacter.findMany({
    where: { GameIDC: { in: names } },
    select: { Id: true, GameIDC: true },
  });
  const playing = slots.flatMap((row) =>
    row.GameIDC ? [{ accountId: row.Id, name: row.GameIDC }] : [],
  );
  if (playing.length === 0) return new Set();

  const onlineAccounts = await prisma.mEMB_STAT.findMany({
    where: {
      memb___id: { in: [...new Set(playing.map((row) => row.accountId))] },
      ConnectStat: { not: 0 },
    },
    select: { memb___id: true },
  });
  const onlineIds = new Set(onlineAccounts.map((row) => row.memb___id));

  return new Set(
    playing
      .filter((row) => onlineIds.has(row.accountId))
      .map((row) => row.name),
  );
}
