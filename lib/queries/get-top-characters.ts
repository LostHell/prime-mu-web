import { CHARACTER_CLASS_BY_ID } from "@/lib/game/constants/characters";
import { CharacterClass } from "@/lib/types/character";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";
import { RANKING_PAGE_SIZE } from "@/constants/pagination";

export interface TopCharacterEntry {
  rank: number;
  name: string;
  class: CharacterClass;
  level: number;
  resets: number;
  guild?: string;
}

type RankedRow = {
  Name: string;
  Class: number | null;
  cLevel: number;
  ResetCount: number;
  ranking: bigint;
};

export async function getTopCharacters({
  page = 1,
  query = "",
  classId,
  pageSize = RANKING_PAGE_SIZE,
}: {
  page?: number;
  query?: string;
  classId?: number;
  pageSize?: number;
} = {}) {
  // MySQL 8 ranks before filtering so searching retains the actual global rank.
  // All user input stays bound parameters, including LIKE text and pagination.
  const rows = await prisma.$queryRaw<RankedRow[]>(Prisma.sql`
    SELECT * FROM (
      SELECT Name, Class, cLevel, ResetCount,
        ROW_NUMBER() OVER (ORDER BY ResetCount DESC, cLevel DESC, Name ASC) AS ranking
      FROM \`Character\`
    ) AS ranked
    WHERE Name LIKE ${"%" + query.replace(/[!%_]/g, "!$&") + "%"} ESCAPE '!'
    ${classId === undefined ? Prisma.empty : Prisma.sql`AND Class = ${classId}`}
    ORDER BY ranking
    LIMIT ${pageSize + 1} OFFSET ${(page - 1) * pageSize}
  `);
  const visible = rows.slice(0, pageSize);
  const guildMembers = visible.length
    ? await prisma.guildMember.findMany({
        where: { Name: { in: visible.map((row) => row.Name) } },
        select: { Name: true, G_Name: true },
      })
    : [];
  const guildMap = new Map(guildMembers.map((g) => [g.Name, g.G_Name]));
  const characters: TopCharacterEntry[] = visible.map((row) => ({
    rank: Number(row.ranking),
    name: row.Name,
    class: CHARACTER_CLASS_BY_ID[row.Class ?? 0],
    level: row.cLevel,
    resets: row.ResetCount,
    guild: guildMap.get(row.Name),
  }));
  return { characters, hasNext: rows.length > pageSize };
}
