import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/game";
import { prisma } from "@/prisma/prisma";

export async function getCharacter(
  accountId: string,
  characterName: string,
) {
  const character = await prisma.character.findFirst({
    where: {
      Name: characterName,
      AccountID: accountId,
    },
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
  });

  if (!character) {
    return null;
  }

  return {
    name: character.Name,
    class: CHARACTER_CLASS_BY_ID[character.Class ?? 0],
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
  };
}
