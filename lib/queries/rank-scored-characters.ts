import "server-only";

import { characterClassName } from "@/lib/game/characters/class-name";
import { UNKNOWN_CHARACTER_CLASS } from "@/lib/game/constants/characters";
import { type CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export type ScoredRankingEntry = {
  rank: number;
  name: string;
  class: CharacterClass | typeof UNKNOWN_CHARACTER_CLASS;
  score: number;
};

/** Attaches each scored row's character class. Shared by the event rankings. */
export async function rankScoredCharacters(
  rankings: { Name: string; Score: number | null }[],
): Promise<ScoredRankingEntry[]> {
  const characters = await prisma.character.findMany({
    where: { Name: { in: rankings.map((entry) => entry.Name) } },
    select: { Name: true, Class: true },
  });
  const classMap = new Map(characters.map((row) => [row.Name, row.Class]));

  return rankings.map((entry, index) => ({
    rank: index + 1,
    name: entry.Name,
    class: characterClassName(classMap.get(entry.Name)),
    score: entry.Score ?? 0,
  }));
}
