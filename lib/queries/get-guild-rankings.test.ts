import { prisma } from "@/prisma/prisma";
import { getGuildRankings } from "./get-guild-rankings";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    guild: { findMany: jest.fn() },
    guildMember: { groupBy: jest.fn() },
  },
}));

const guildRows = [
  { G_Name: "Codex", G_Master: "Knight", G_Score: 20 },
  { G_Name: "Empty", G_Master: null, G_Score: null },
];

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.guild.findMany as jest.Mock).mockResolvedValue(guildRows);
  (prisma.guildMember.groupBy as jest.Mock).mockResolvedValue([
    { G_Name: "Codex", _count: { _all: 4 } },
  ]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("ranks the full list and pages it in memory", async () => {
  const result = await getGuildRankings({ page: 2, pageSize: 1 });

  expect(prisma.guild.findMany).toHaveBeenCalledWith({
    orderBy: [{ G_Score: "desc" }, { G_Name: "asc" }],
    select: { G_Name: true, G_Master: true, G_Score: true },
  });
  expect(result).toEqual({
    guilds: [{ rank: 2, name: "Empty", master: "—", members: 0, score: 0 }],
    hasNext: false,
  });
});

test("skips the member count when there are no guilds", async () => {
  (prisma.guild.findMany as jest.Mock).mockResolvedValue([]);

  await expect(getGuildRankings()).resolves.toEqual({
    guilds: [],
    hasNext: false,
  });
  expect(prisma.guildMember.groupBy).not.toHaveBeenCalled();
});

test("reuses the guild list until it is thirty seconds old", async () => {
  await getGuildRankings({ page: 1 });
  jest.spyOn(Date, "now").mockReturnValue(now + 29_999);

  await getGuildRankings({ page: 2, pageSize: 1 });

  expect(prisma.guild.findMany).toHaveBeenCalledTimes(1);
});

test("reads the guild list again once it is thirty seconds old", async () => {
  await getGuildRankings();
  jest.spyOn(Date, "now").mockReturnValue(now + 30_000);

  await getGuildRankings();

  expect(prisma.guild.findMany).toHaveBeenCalledTimes(2);
});

test("shares one guild read across overlapping callers", async () => {
  let resolveGuilds: (value: unknown) => void = () => {};
  (prisma.guild.findMany as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveGuilds = resolve;
    }),
  );

  const first = getGuildRankings({ pageSize: 1 });
  const second = getGuildRankings({ page: 2, pageSize: 1 });
  resolveGuilds(guildRows);

  const [leaders, page] = await Promise.all([first, second]);

  expect(leaders.guilds[0]?.name).toBe("Codex");
  expect(page.guilds[0]?.name).toBe("Empty");
  expect(prisma.guild.findMany).toHaveBeenCalledTimes(1);
});

test("tries the guild list again after a read fails", async () => {
  (prisma.guild.findMany as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getGuildRankings()).rejects.toThrow("db down");

  const result = await getGuildRankings({ pageSize: 1 });

  expect(result.guilds[0]?.name).toBe("Codex");
  expect(prisma.guild.findMany).toHaveBeenCalledTimes(2);
});

test("does not query the database when the requested offset is not exact", async () => {
  const result = await getGuildRankings({ page: Number.MAX_SAFE_INTEGER });

  expect(result).toEqual({ guilds: [], hasNext: false });
  expect(prisma.guild.findMany).not.toHaveBeenCalled();
});
