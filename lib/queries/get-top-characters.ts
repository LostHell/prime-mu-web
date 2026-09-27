import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";
import {
  getRankedCharacters,
  getRankedCharactersByClass,
} from "@/prisma/generated/prisma/sql";
import { MAX_SEARCH_LENGTH, RANKING_PAGE_SIZE } from "@/constants/pagination";

export interface TopCharacterEntry {
  rank: number;
  name: string;
  class: CharacterClass;
  level: number;
  resets: number;
  guild?: string;
}

export async function getTopCharacters({
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
    Number.isSafeInteger(pageSize) &&
    pageSize > 0 &&
    pageSize < Number.MAX_SAFE_INTEGER
      ? pageSize
      : RANKING_PAGE_SIZE;
  const namePattern = `%${query
    .slice(0, MAX_SEARCH_LENGTH)
    .replace(/[!%_]/g, "!$&")}%`;
  const rowLimit = normalizedPageSize + 1;
  const rowOffset = (normalizedPage - 1) * normalizedPageSize;

  // A URL can contain a page whose calculated offset exceeds JavaScript's
  // exact integer range. Treat it as an empty page so the route redirects to 1.
  if (!Number.isSafeInteger(rowOffset)) {
    return { characters: [], hasNext: false };
  }

  // Ranking happens inside each static query before filters are applied, so
  // filtered results keep their global rank. TypedSQL binds every argument.
  const rows = await prisma.$queryRawTyped(
    classId === undefined
      ? getRankedCharacters(namePattern, rowLimit, rowOffset)
      : getRankedCharactersByClass(namePattern, classId, rowLimit, rowOffset),
  );
  const visible = rows.slice(0, normalizedPageSize);
  const guildMembers = visible.length
    ? await prisma.guildMember.findMany({
        where: { Name: { in: visible.map((row) => row.Name) } },
        select: { Name: true, G_Name: true },
      })
    : [];
  const guildMap = new Map(guildMembers.map((g) => [g.Name, g.G_Name]));
  const characters: TopCharacterEntry[] = visible.map((row) => ({
    rank: Number(row.ranking),
    name: row.Name,
    class: CHARACTER_CLASS_BY_ID[row.Class ?? 0],
    level: Number(row.cLevel),
    resets: Number(row.ResetCount),
    guild: guildMap.get(row.Name),
  }));
  return { characters, hasNext: rows.length > normalizedPageSize };
}
