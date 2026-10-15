import "server-only";

import { cacheFor } from "@/lib/utils/cache-for";
import { prisma } from "@/prisma/prisma";
import {
  rankScoredCharacters,
  type ScoredRankingEntry,
} from "./rank-scored-characters";

export type BloodCastleRankingEntry = ScoredRankingEntry;

const EVENT_RANKING_CACHE_MS = 30_000;

// The events tab loads this beside Devil Square. One shared read serves both
// visitors instead of each checkout against Character.
const loadBloodCastleRanking = cacheFor(
  EVENT_RANKING_CACHE_MS,
  async (): Promise<BloodCastleRankingEntry[]> => {
    const rankings = await prisma.rankingBloodCastle.findMany({
      take: 10,
      orderBy: { Score: "desc" },
      select: { Name: true, Score: true },
    });

    return rankScoredCharacters(rankings);
  },
);

export function getBloodCastleRanking(): Promise<BloodCastleRankingEntry[]> {
  return loadBloodCastleRanking();
}
