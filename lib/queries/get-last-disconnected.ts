import { CHARACTER_CLASS_BY_ID, MAP_NAME_BY_ID } from "@/lib/game/constants/game";
import { CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";

export interface LastDisconnectedEntry {
  name: string;
  map: string;
  class: CharacterClass;
  time: string;
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export async function getLastDisconnected(): Promise<LastDisconnectedEntry[]> {
  const stats = await prisma.mEMB_STAT.findMany({
    where: {
      ConnectStat: 0,
      DisConnectTM: { not: null },
    },
    take: 10,
    orderBy: { DisConnectTM: "desc" },
    select: {
      memb___id: true,
      DisConnectTM: true,
    },
  });

  const accountIds = stats.map((s) => s.memb___id);

  const accountCharacters = await prisma.accountCharacter.findMany({
    where: { Id: { in: accountIds } },
    select: { Id: true, GameIDC: true, GameID1: true },
  });

  const accountCharMap = new Map(
    accountCharacters.map((ac) => [ac.Id, ac.GameIDC ?? ac.GameID1]),
  );

  const characterNames = accountCharacters
    .map((ac) => ac.GameIDC ?? ac.GameID1)
    .filter((name): name is string => name !== null && name !== undefined);

  const characters = await prisma.character.findMany({
    where: { Name: { in: characterNames } },
    select: { Name: true, Class: true, MapNumber: true },
  });

  const characterMap = new Map(characters.map((c) => [c.Name, c]));

  return stats.flatMap((stat) => {
    const charName = accountCharMap.get(stat.memb___id);
    if (!charName) return [];
    const character = characterMap.get(charName);
    if (!character) return [];

    return [
      {
        name: charName,
        map: MAP_NAME_BY_ID[character.MapNumber ?? 0],
        class: CHARACTER_CLASS_BY_ID[character.Class ?? 0],
        time: stat.DisConnectTM ? formatRelativeTime(stat.DisConnectTM) : "—",
      },
    ];
  });
}
