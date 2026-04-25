import { prisma } from "@/prisma/prisma";
import { MU_CLASS_BY_ID, MuClass } from "@/types/character";

export interface LastDisconnectedEntry {
  name: string;
  map: string;
  class: MuClass;
  time: string;
}

const MU_MAP_BY_ID: Record<number, string> = {
  0: "Lorencia",
  1: "Dungeon",
  2: "Devias",
  3: "Noria",
  4: "Lost Tower",
  5: "Dare Devil",
  6: "Arena",
  7: "Atlans",
  8: "Tarkan",
  9: "Devil Square 1",
  10: "Icarus",
  11: "Blood Castle 1",
  12: "Blood Castle 2",
  13: "Blood Castle 3",
  14: "Blood Castle 4",
  15: "Blood Castle 5",
  16: "Blood Castle 6",
};

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
        map: MU_MAP_BY_ID[character.MapNumber ?? 0] ?? "Lorencia",
        class: MU_CLASS_BY_ID[character.Class ?? 0] ?? "Dark Wizard",
        time: stat.DisConnectTM ? formatRelativeTime(stat.DisConnectTM) : "—",
      },
    ];
  });
}
