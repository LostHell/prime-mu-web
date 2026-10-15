import "server-only";

import { MAX_SEARCH_LENGTH, RANKING_PAGE_SIZE } from "@/constants/pagination";
import { characterClassName } from "@/lib/game/characters/class-name";
import { UNKNOWN_CHARACTER_CLASS } from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";
import { cacheFor } from "@/lib/utils/cache-for";
import { getLeaderboard } from "@/prisma/generated/prisma/sql";
import { prisma } from "@/prisma/prisma";

export interface RankingEntry {
  rank: number;
  name: string;
  class: CharacterClass | typeof UNKNOWN_CHARACTER_CLASS;
  level: number;
  resets: number;
  guild?: string;
}

type LeaderboardEntry = RankingEntry & { classId: number | null };

const LEADERBOARD_CACHE_MS = 30_000;

// One ordering of Character, joined to guilds. Home and the rankings page both
// ask for it, so overlapping views share the read and then reuse it instead of
// sorting the table again. Paging, search, and class run on this list, which
// keeps a filtered character's global rank.
const loadLeaderboard = cacheFor(
  LEADERBOARD_CACHE_MS,
  async (): Promise<LeaderboardEntry[]> => {
    const rows = await prisma.$queryRawTyped(getLeaderboard());

    return rows.map((row) => ({
      rank: Number(row.ranking),
      name: row.Name,
      classId: row.Class,
      class: characterClassName(row.Class),
      level: Number(row.cLevel),
      resets: Number(row.ResetCount),
      ...(row.guild ? { guild: row.guild } : {}),
    }));
  },
);

export async function getRankings({
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
  const rowOffset = (normalizedPage - 1) * normalizedPageSize;

  // A URL can contain a page whose calculated offset exceeds JavaScript's
  // exact integer range. Treat it as an empty page so the route redirects to 1.
  if (!Number.isSafeInteger(rowOffset)) {
    return { characters: [], hasNext: false };
  }

  const needle = query.slice(0, MAX_SEARCH_LENGTH).toLowerCase();
  const leaderboard = await loadLeaderboard();
  const matches = leaderboard.filter((entry) => {
    if (classId !== undefined && entry.classId !== classId) return false;
    if (!needle) return true;
    return entry.name.toLowerCase().includes(needle);
  });
  const visible = matches.slice(rowOffset, rowOffset + normalizedPageSize);

  return {
    characters: visible.map(
      (entry: LeaderboardEntry): RankingEntry => ({
        rank: entry.rank,
        name: entry.name,
        class: entry.class,
        level: entry.level,
        resets: entry.resets,
        ...(entry.guild ? { guild: entry.guild } : {}),
      }),
    ),
    hasNext: matches.length > rowOffset + normalizedPageSize,
  };
}
