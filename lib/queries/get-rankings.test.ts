import { prisma } from "@/prisma/prisma";
import { getLeaderboard } from "@/prisma/generated/prisma/sql";
import { getRankings } from "./get-rankings";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    $queryRawTyped: jest.fn(),
  },
}));
jest.mock("@/prisma/generated/prisma/sql", () => ({
  getLeaderboard: jest.fn(() => ({ query: "leaderboard" })),
}));

const leaderboardRows = [
  {
    Name: "Knight",
    Class: 16,
    cLevel: 400n,
    ResetCount: 12n,
    ranking: 1n,
    guild: "Codex",
  },
  {
    Name: "Wizard",
    Class: 0,
    cLevel: 350n,
    ResetCount: 9n,
    ranking: 2n,
    guild: null,
  },
  {
    Name: "Elf",
    Class: 32,
    cLevel: 200n,
    ResetCount: 4n,
    ranking: 3n,
    guild: null,
  },
];

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue(leaderboardRows);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("reads the typed leaderboard and keeps each character's rank and guild", async () => {
  const result = await getRankings({ pageSize: 2 });

  expect(getLeaderboard).toHaveBeenCalledWith();
  expect(prisma.$queryRawTyped).toHaveBeenCalledWith({ query: "leaderboard" });
  expect(result).toEqual({
    characters: [
      {
        rank: 1,
        name: "Knight",
        class: "Dark Knight",
        level: 400,
        resets: 12,
        guild: "Codex",
      },
      {
        rank: 2,
        name: "Wizard",
        class: "Dark Wizard",
        level: 350,
        resets: 9,
      },
    ],
    hasNext: true,
  });
});

test("keeps the global rank when a class filter hides higher characters", async () => {
  const result = await getRankings({ classId: 0 });

  expect(result).toEqual({
    characters: [
      {
        rank: 2,
        name: "Wizard",
        class: "Dark Wizard",
        level: 350,
        resets: 9,
      },
    ],
    hasNext: false,
  });
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("matches a name that contains the search text", async () => {
  const result = await getRankings({ query: "night" });

  expect(result.characters.map((character) => character.name)).toEqual([
    "Knight",
  ]);
});

test("treats % and _ in the search text as literal characters", async () => {
  await expect(getRankings({ query: "Knight%" })).resolves.toMatchObject({
    characters: [],
  });
  await expect(getRankings({ query: "Kni_ght" })).resolves.toMatchObject({
    characters: [],
  });
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("reuses the leaderboard until it is thirty seconds old", async () => {
  await getRankings();
  jest.spyOn(Date, "now").mockReturnValue(now + 29_999);

  await getRankings({ page: 2, classId: 32 });

  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("reads the leaderboard again once it is thirty seconds old", async () => {
  await getRankings();
  jest.spyOn(Date, "now").mockReturnValue(now + 30_000);
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue([
    {
      Name: "Muse",
      Class: 33,
      cLevel: 10n,
      ResetCount: 1n,
      ranking: 1n,
      guild: null,
    },
  ]);

  const result = await getRankings();

  expect(result.characters).toEqual([
    {
      rank: 1,
      name: "Muse",
      class: "Muse Elf",
      level: 10,
      resets: 1,
    },
  ]);
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(2);
});

test("shares one leaderboard read across overlapping callers", async () => {
  let resolveQuery: (value: unknown) => void = () => {};
  (prisma.$queryRawTyped as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveQuery = resolve;
    }),
  );

  const first = getRankings({ pageSize: 3 });
  const second = getRankings({ page: 2 });
  resolveQuery(leaderboardRows);

  const [leaders, page] = await Promise.all([first, second]);

  expect(leaders.characters).toHaveLength(3);
  expect(page.characters).toEqual([]);
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("tries the leaderboard again after a read fails", async () => {
  (prisma.$queryRawTyped as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getRankings()).rejects.toThrow("db down");

  const result = await getRankings({ pageSize: 1 });

  expect(result.characters[0]?.name).toBe("Knight");
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(2);
});

test("normalizes an invalid page and page size onto the first default page", async () => {
  const result = await getRankings({ page: 0, pageSize: 0 });

  expect(result.characters).toHaveLength(3);
  expect(result.hasNext).toBe(false);
});

test("does not query the database when the requested offset is not exact", async () => {
  const result = await getRankings({ page: Number.MAX_SAFE_INTEGER });

  expect(result).toEqual({ characters: [], hasNext: false });
  expect(prisma.$queryRawTyped).not.toHaveBeenCalled();
});
