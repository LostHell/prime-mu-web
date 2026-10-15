import { prisma } from "@/prisma/prisma";
import { getDevilSquareRanking } from "./get-devil-square-ranking";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    rankingDevilSquare: { findMany: jest.fn() },
    character: { findMany: jest.fn() },
  },
}));

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.rankingDevilSquare.findMany as jest.Mock).mockResolvedValue([
    { Name: "Elf", Score: null },
  ]);
  (prisma.character.findMany as jest.Mock).mockResolvedValue([
    { Name: "Elf", Class: 32 },
  ]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("ranks Devil Square scores and attaches the character class", async () => {
  await expect(getDevilSquareRanking()).resolves.toEqual([
    { rank: 1, name: "Elf", class: "Fairy Elf", score: 0 },
  ]);
  expect(prisma.rankingDevilSquare.findMany).toHaveBeenCalledWith({
    take: 10,
    orderBy: { Score: "desc" },
    select: { Name: true, Score: true },
  });
});

test("reuses the Devil Square ranking until it is thirty seconds old", async () => {
  await getDevilSquareRanking();
  jest.spyOn(Date, "now").mockReturnValue(now + 29_999);

  await getDevilSquareRanking();

  expect(prisma.rankingDevilSquare.findMany).toHaveBeenCalledTimes(1);
});

test("reads the Devil Square ranking again once it is thirty seconds old", async () => {
  await getDevilSquareRanking();
  jest.spyOn(Date, "now").mockReturnValue(now + 30_000);

  await getDevilSquareRanking();

  expect(prisma.rankingDevilSquare.findMany).toHaveBeenCalledTimes(2);
});

test("shares one Devil Square read across overlapping callers", async () => {
  let resolveRanking: (value: unknown) => void = () => {};
  (prisma.rankingDevilSquare.findMany as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveRanking = resolve;
    }),
  );

  const first = getDevilSquareRanking();
  const second = getDevilSquareRanking();
  resolveRanking([{ Name: "Elf", Score: null }]);

  const [left, right] = await Promise.all([first, second]);

  expect(left).toEqual(right);
  expect(prisma.rankingDevilSquare.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
});

test("tries the Devil Square ranking again after a read fails", async () => {
  (prisma.rankingDevilSquare.findMany as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getDevilSquareRanking()).rejects.toThrow("db down");

  await expect(getDevilSquareRanking()).resolves.toEqual([
    { rank: 1, name: "Elf", class: "Fairy Elf", score: 0 },
  ]);
  expect(prisma.rankingDevilSquare.findMany).toHaveBeenCalledTimes(2);
});
