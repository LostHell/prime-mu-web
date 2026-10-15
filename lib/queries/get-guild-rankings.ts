import "server-only";

import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import { cacheFor } from "@/lib/utils/cache-for";
import { prisma } from "@/prisma/prisma";

export type GuildRankingEntry = {
  rank: number;
  name: string;
  master: string;
  members: number;
  score: number;
};

const GUILD_RANKING_CACHE_MS = 30_000;

// Guilds are a small table. One ordered list, with member counts, serves every
// page of the guilds tab for 30 seconds.
const loadGuildRankings = cacheFor(
  GUILD_RANKING_CACHE_MS,
  async (): Promise<GuildRankingEntry[]> => {
    const rows = await prisma.guild.findMany({
      orderBy: [{ G_Score: "desc" }, { G_Name: "asc" }],
      select: { G_Name: true, G_Master: true, G_Score: true },
    });
    const counts = rows.length
      ? await prisma.guildMember.groupBy({
          by: ["G_Name"],
          where: { G_Name: { in: rows.map((row) => row.G_Name) } },
          _count: { _all: true },
        })
      : [];
    const memberCount = new Map(
      counts.map((row) => [row.G_Name, row._count._all]),
    );

    return rows.map((row, index) => ({
      rank: index + 1,
      name: row.G_Name,
      master: row.G_Master || "—",
      members: memberCount.get(row.G_Name) ?? 0,
      score: row.G_Score ?? 0,
    }));
  },
);

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

  const guilds = await loadGuildRankings();
  const visible = guilds.slice(rowOffset, rowOffset + normalizedPageSize);

  return {
    guilds: visible.map((guild) => ({ ...guild })),
    hasNext: guilds.length > rowOffset + normalizedPageSize,
  };
}
