import { prisma } from "@/prisma/prisma";
import { getBloodCastleRanking } from "./get-blood-castle-ranking";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    rankingBloodCastle: { findMany: jest.fn() },
    character: { findMany: jest.fn() },
  },
}));

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.rankingBloodCastle.findMany as jest.Mock).mockResolvedValue([
    { Name: "Knight", Score: 12 },
  ]);
  (prisma.character.findMany as jest.Mock).mockResolvedValue([
    { Name: "Knight", Class: 16 },
  ]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("ranks Blood Castle scores and attaches the character class", async () => {
  await expect(getBloodCastleRanking()).resolves.toEqual([
    { rank: 1, name: "Knight", class: "Dark Knight", score: 12 },
  ]);
  expect(prisma.rankingBloodCastle.findMany).toHaveBeenCalledWith({
    take: 10,
    orderBy: { Score: "desc" },
    select: { Name: true, Score: true },
  });
});

test("reuses the Blood Castle ranking until it is thirty seconds old", async () => {
  await getBloodCastleRanking();
  jest.spyOn(Date, "now").mockReturnValue(now + 29_999);

  await getBloodCastleRanking();

  expect(prisma.rankingBloodCastle.findMany).toHaveBeenCalledTimes(1);
});

test("reads the Blood Castle ranking again once it is thirty seconds old", async () => {
  await getBloodCastleRanking();
  jest.spyOn(Date, "now").mockReturnValue(now + 30_000);

  await getBloodCastleRanking();

  expect(prisma.rankingBloodCastle.findMany).toHaveBeenCalledTimes(2);
});

test("shares one Blood Castle read across overlapping callers", async () => {
  let resolveRanking: (value: unknown) => void = () => {};
  (prisma.rankingBloodCastle.findMany as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveRanking = resolve;
    }),
  );

  const first = getBloodCastleRanking();
  const second = getBloodCastleRanking();
  resolveRanking([{ Name: "Knight", Score: 12 }]);

  const [left, right] = await Promise.all([first, second]);

  expect(left).toEqual(right);
  expect(prisma.rankingBloodCastle.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
});

test("tries the Blood Castle ranking again after a read fails", async () => {
  (prisma.rankingBloodCastle.findMany as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getBloodCastleRanking()).rejects.toThrow("db down");

  await expect(getBloodCastleRanking()).resolves.toEqual([
    { rank: 1, name: "Knight", class: "Dark Knight", score: 12 },
  ]);
  expect(prisma.rankingBloodCastle.findMany).toHaveBeenCalledTimes(2);
});
