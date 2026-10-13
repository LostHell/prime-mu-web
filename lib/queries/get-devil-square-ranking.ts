import "server-only";

import { prisma } from "@/prisma/prisma";
import {
  rankScoredCharacters,
  type ScoredRankingEntry,
} from "./rank-scored-characters";

export type DevilSquareRankingEntry = ScoredRankingEntry;

export async function getDevilSquareRanking(): Promise<
  DevilSquareRankingEntry[]
> {
  const rankings = await prisma.rankingDevilSquare.findMany({
    take: 10,
    orderBy: { Score: "desc" },
    select: { Name: true, Score: true },
  });

  return rankScoredCharacters(rankings);
}
