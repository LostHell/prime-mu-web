import "server-only";

import { cacheFor } from "@/lib/utils/cache-for";
import { prisma } from "@/prisma/prisma";

const ONLINE_NAMES_CACHE_MS = 5_000;

/** Account ids whose ConnectStat says they are in the game. */
export async function getOnlineAccountIds(): Promise<string[]> {
  const onlineAccounts = await prisma.mEMB_STAT.findMany({
    where: { ConnectStat: { not: 0 } },
    select: { memb___id: true },
  });
  return onlineAccounts.map((row) => row.memb___id);
}

// The players tab and the online tab both read MEMB_STAT. One shared list of
// the character in each connected account serves both, for the same window as
// the game-server port check.
const loadCharactersInGame = cacheFor(
  ONLINE_NAMES_CACHE_MS,
  async (): Promise<Set<string>> => {
    const accountIds = await getOnlineAccountIds();
    if (accountIds.length === 0) return new Set();

    const slots = await prisma.accountCharacter.findMany({
      where: { Id: { in: accountIds }, GameIDC: { not: null } },
      select: { GameIDC: true },
    });
    return new Set(slots.flatMap((row) => (row.GameIDC ? [row.GameIDC] : [])));
  },
);

/**
 * Character names currently in the game: AccountCharacter.GameIDC for a
 * connected account. Other characters on that account are not included.
 */
export async function getCharactersInGame(): Promise<string[]> {
  return [...(await loadCharactersInGame())];
}

/** Which of `names` are the character currently in the game. */
export async function getOnlineCharacterNames(
  names: string[],
): Promise<Set<string>> {
  if (names.length === 0) return new Set();

  const inGame = await loadCharactersInGame();
  return new Set(names.filter((name) => inGame.has(name)));
}
