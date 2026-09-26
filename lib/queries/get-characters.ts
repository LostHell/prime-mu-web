import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { Character } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";
import {
  getBaseClass,
  getEquipmentStatus,
  getResetPoints,
} from "@/lib/game/characters/reset";

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
      Inventory: true,
    },
    orderBy: { Name: "asc" },
  });

  const memberships = characters.length
    ? await prisma.guildMember.findMany({
        where: { Name: { in: characters.map((character) => character.Name) } },
        select: { Name: true, G_Name: true },
      })
    : [];
  const guilds = new Map(
    memberships.map((membership) => [membership.Name, membership.G_Name]),
  );
  const [accountStatus, defaults] = await Promise.all([
    prisma.mEMB_STAT.findUnique({
      where: { memb___id: accountId },
      select: { ConnectStat: true },
    }),
    prisma.defaultClassType.findMany({
      where: {
        Class: {
          in: [
            ...new Set(
              characters.map((character) => getBaseClass(character.Class ?? 0)),
            ),
          ],
        },
      },
      select: { Class: true, Level: true, LevelUpPoint: true },
    }),
  ]);
  const classDefaults = new Map(defaults.map((entry) => [entry.Class, entry]));

  return characters.map((character) => {
    const defaults = classDefaults.get(getBaseClass(character.Class ?? 0));
    return {
      name: character.Name,
      class: CHARACTER_CLASS_BY_ID[character.Class ?? 0],
      level: character.cLevel ?? 1,
      resets: character.ResetCount ?? 0,
      guild: guilds.get(character.Name),
      zen: character.Money ?? 0,
      pkCount: character.PkCount ?? 0,
      freePoints: character.LevelUpPoint ?? 0,
      resetPreview: defaults
        ? {
            isOffline: accountStatus?.ConnectStat === 0,
            equipment: getEquipmentStatus(character.Inventory),
            level: defaults.Level ?? 1,
            freePoints: getResetPoints(
              character.ResetCount ?? 0,
              defaults.LevelUpPoint ?? 0,
            ),
          }
        : null,
      stats: {
        str: character.Strength ?? 0,
        agi: character.Dexterity ?? 0,
        vit: character.Vitality ?? 0,
        ene: character.Energy ?? 0,
        cmd: 0,
      },
    };
  });
}
