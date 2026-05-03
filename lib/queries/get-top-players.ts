import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export interface TopPlayerEntry {
  rank: number;
  name: string;
  class: CharacterClass;
  level: number;
  resets: number;
  guild?: string;
}

export async function getTopPlayers(): Promise<TopPlayerEntry[]> {
  const characters = await prisma.character.findMany({
    orderBy: [{ ResetCount: "desc" }, { cLevel: "desc" }],
    select: {
      Name: true,
      Class: true,
      cLevel: true,
      ResetCount: true,
    },
  });

  const names = characters.map((c) => c.Name);
  const guildMembers = await prisma.guildMember.findMany({
    where: { Name: { in: names } },
    select: { Name: true, G_Name: true },
  });

  const guildMap = new Map(guildMembers.map((g) => [g.Name, g.G_Name]));

  return characters.map((c, i) => ({
    rank: i + 1,
    name: c.Name,
    class: CHARACTER_CLASS_BY_ID[c.Class ?? 0],
    level: c.cLevel ?? 1,
    resets: c.ResetCount ?? 0,
    guild: guildMap.get(c.Name),
  }));
}
