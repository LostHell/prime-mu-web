import { MU_CLASS_BY_ID, MuClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export interface BloodCastleRankingEntry {
  rank: number;
  name: string;
  class: MuClass;
  score: number;
}

export async function getBloodCastleRanking(): Promise<BloodCastleRankingEntry[]> {
  const rankings = await prisma.rankingBloodCastle.findMany({
    take: 10,
    orderBy: { Score: "desc" },
    select: {
      Name: true,
      Score: true,
    },
  });

  const names = rankings.map((r) => r.Name);
  const characters = await prisma.character.findMany({
    where: { Name: { in: names } },
    select: { Name: true, Class: true },
  });

  const classMap = new Map(characters.map((c) => [c.Name, c.Class]));

  return rankings.map((entry, i) => ({
    rank: i + 1,
    name: entry.Name,
    class: MU_CLASS_BY_ID[classMap.get(entry.Name) ?? 0] ?? "Dark Knight",
    score: entry.Score ?? 0,
  }));
}
