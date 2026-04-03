import { Character, MU_CLASS_BY_ID } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export async function getCharacters(accountId: string): Promise<Character[]> {
  const characters = await prisma.character.findMany({
    where: { AccountID: accountId },
    select: {
      Name: true,
      Class: true,
      cLevel: true,
      ResetCount: true,
      Money: true,
      PkCount: true,
      LevelUpPoint: true,
      Strength: true,
      Dexterity: true,
      Vitality: true,
      Energy: true,
    },
    orderBy: { Name: "asc" },
  });

  return characters.map((character) => ({
    name: character.Name,
    class: MU_CLASS_BY_ID[character.Class ?? 0] ?? "Dark Wizard",
    level: character.cLevel ?? 1,
    resets: character.ResetCount ?? 0,
    guild: undefined,
    zen: character.Money ?? 0,
    pkCount: character.PkCount ?? 0,
    freePoints: character.LevelUpPoint ?? 0,
    stats: {
      str: character.Strength ?? 0,
      agi: character.Dexterity ?? 0,
      vit: character.Vitality ?? 0,
      ene: character.Energy ?? 0,
      cmd: 0,
    },
  }));
}
