import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export interface BloodCastleRankingEntry {
  rank: number;
  name: string;
  class: CharacterClass;
  score: number;
}

export async function getBloodCastleRanking(): Promise<
  BloodCastleRankingEntry[]
> {
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
    class:
      CHARACTER_CLASS_BY_ID[classMap.get(entry.Name) ?? 0],
    score: entry.Score ?? 0,
  }));
}
