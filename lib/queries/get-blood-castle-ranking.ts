import "server-only";

import { prisma } from "@/prisma/prisma";
import {
  rankScoredCharacters,
  type ScoredRankingEntry,
} from "./rank-scored-characters";

export type BloodCastleRankingEntry = ScoredRankingEntry;

export async function getBloodCastleRanking(): Promise<
  BloodCastleRankingEntry[]
> {
  const rankings = await prisma.rankingBloodCastle.findMany({
    take: 10,
    orderBy: { Score: "desc" },
    select: { Name: true, Score: true },
  });

  return rankScoredCharacters(rankings);
}
