import { MU_CLASS_BY_ID, MuClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export interface TopPlayerEntry {
  rank: number;
  name: string;
  class: MuClass;
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
    class: MU_CLASS_BY_ID[c.Class ?? 0] ?? "Dark Wizard",
    level: c.cLevel ?? 1,
    resets: c.ResetCount ?? 0,
    guild: guildMap.get(c.Name),
  }));
}
