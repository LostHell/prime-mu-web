import "server-only";

import { RANKING_PAGE_SIZE, MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { characterClassName } from "@/lib/game/characters/class-name";
import { prisma } from "@/prisma/prisma";
import { getCharactersInGame } from "./get-character-online-status";
import type { RankingEntry } from "./get-rankings";

export async function getOnlineRankings({
  page = 1,
  query = "",
  classId,
  pageSize = RANKING_PAGE_SIZE,
}: {
  page?: number;
  query?: string;
  classId?: number;
  pageSize?: number;
} = {}) {
  const normalizedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const normalizedPageSize =
    Number.isSafeInteger(pageSize) && pageSize > 0
      ? pageSize
      : RANKING_PAGE_SIZE;
  const rowOffset = (normalizedPage - 1) * normalizedPageSize;
  if (!Number.isSafeInteger(rowOffset)) {
    return { characters: [] as RankingEntry[], hasNext: false };
  }

  const inGame = await getCharactersInGame();
  if (inGame.length === 0) {
    return { characters: [] as RankingEntry[], hasNext: false };
  }

  const name = query.slice(0, MAX_SEARCH_LENGTH).trim();
  const rows = await prisma.character.findMany({
    where: {
      Name: {
        in: inGame,
        ...(name ? { contains: name } : {}),
      },
      ...(classId === undefined ? {} : { Class: classId }),
    },
    orderBy: [{ ResetCount: "desc" }, { cLevel: "desc" }, { Name: "asc" }],
    skip: rowOffset,
    take: normalizedPageSize + 1,
    select: { Name: true, Class: true, cLevel: true, ResetCount: true },
  });
  const visible = rows.slice(0, normalizedPageSize);
  const guildMembers = visible.length
    ? await prisma.guildMember.findMany({
        where: { Name: { in: visible.map((row) => row.Name) } },
        select: { Name: true, G_Name: true },
      })
    : [];
  const guildMap = new Map(guildMembers.map((row) => [row.Name, row.G_Name]));
  const characters: RankingEntry[] = visible.map((row, index) => ({
    rank: rowOffset + index + 1,
    name: row.Name,
    class: characterClassName(row.Class),
    level: row.cLevel,
    resets: row.ResetCount,
    guild: guildMap.get(row.Name),
  }));

  return { characters, hasNext: rows.length > normalizedPageSize };
}
