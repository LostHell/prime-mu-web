import "server-only";

import { cacheFor } from "@/lib/utils/cache-for";
import { prisma } from "@/prisma/prisma";
import {
  rankScoredCharacters,
  type ScoredRankingEntry,
} from "./rank-scored-characters";

export type DevilSquareRankingEntry = ScoredRankingEntry;

const EVENT_RANKING_CACHE_MS = 30_000;

// The events tab loads this beside Blood Castle. One shared read serves both
// visitors instead of each checkout against Character.
const loadDevilSquareRanking = cacheFor(
  EVENT_RANKING_CACHE_MS,
  async (): Promise<DevilSquareRankingEntry[]> => {
    const rankings = await prisma.rankingDevilSquare.findMany({
      take: 10,
      orderBy: { Score: "desc" },
      select: { Name: true, Score: true },
    });

    return rankScoredCharacters(rankings);
  },
);

export function getDevilSquareRanking(): Promise<DevilSquareRankingEntry[]> {
  return loadDevilSquareRanking();
}
