import "server-only";

import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import { prisma } from "@/prisma/prisma";

export type GuildRankingEntry = {
  rank: number;
  name: string;
  master: string;
  members: number;
  score: number;
};

export async function getGuildRankings({
  page = 1,
  pageSize = RANKING_PAGE_SIZE,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const normalizedPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const normalizedPageSize =
    Number.isSafeInteger(pageSize) && pageSize > 0
      ? pageSize
      : RANKING_PAGE_SIZE;
  const rowOffset = (normalizedPage - 1) * normalizedPageSize;
  if (!Number.isSafeInteger(rowOffset)) {
    return { guilds: [] as GuildRankingEntry[], hasNext: false };
  }

  const rows = await prisma.guild.findMany({
    orderBy: [{ G_Score: "desc" }, { G_Name: "asc" }],
    skip: rowOffset,
    take: normalizedPageSize + 1,
    select: { G_Name: true, G_Master: true, G_Score: true },
  });
  const visible = rows.slice(0, normalizedPageSize);
  const counts = visible.length
    ? await prisma.guildMember.groupBy({
        by: ["G_Name"],
        where: { G_Name: { in: visible.map((row) => row.G_Name) } },
        _count: { _all: true },
      })
    : [];
  const memberCount = new Map(
    counts.map((row) => [row.G_Name, row._count._all]),
  );
  const guilds: GuildRankingEntry[] = visible.map((row, index) => ({
    rank: rowOffset + index + 1,
    name: row.G_Name,
    master: row.G_Master || "—",
    members: memberCount.get(row.G_Name) ?? 0,
    score: row.G_Score ?? 0,
  }));

  return { guilds, hasNext: rows.length > normalizedPageSize };
}
