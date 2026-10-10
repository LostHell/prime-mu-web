import { RANKING_PAGE_SIZE } from "@/constants/pagination";
import { prisma } from "@/prisma/prisma";
import {
  getRankedCharacters,
  getRankedCharactersByClass,
} from "@/prisma/generated/prisma/sql";
import { getRankings } from "./get-rankings";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    $queryRawTyped: jest.fn(),
    guildMember: { findMany: jest.fn() },
  },
}));
jest.mock("@/prisma/generated/prisma/sql", () => ({
  getRankedCharacters: jest.fn((...parameters) => ({
    query: "all-classes",
    parameters,
  })),
  getRankedCharactersByClass: jest.fn((...parameters) => ({
    query: "one-class",
    parameters,
  })),
}));

const rankedRows = [
  {
    Name: "Knight",
    Class: 0,
    cLevel: 400n,
    ResetCount: 12n,
    ranking: 7n,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue(rankedRows);
  (prisma.guildMember.findMany as jest.Mock).mockResolvedValue([
    { Name: "Knight", G_Name: "Codex" },
  ]);
});

test("uses the generated unfiltered query and preserves global rank data", async () => {
  const result = await getRankings({ page: 2 });

  expect(getRankedCharacters).toHaveBeenCalledWith(
    "%%",
    RANKING_PAGE_SIZE + 1,
    RANKING_PAGE_SIZE,
  );
  expect(getRankedCharactersByClass).not.toHaveBeenCalled();
  expect(result).toEqual({
    characters: [
      {
        rank: 7,
        name: "Knight",
        class: "Dark Wizard",
        level: 400,
        resets: 12,
        guild: "Codex",
      },
    ],
    hasNext: false,
  });
});

test("uses the class-filtered query and binds escaped search text as a value", async () => {
  await getRankings({
    query: "Blade_100%!' OR 1=1 --",
    classId: 16,
    pageSize: 3,
  });

  expect(getRankedCharactersByClass).toHaveBeenCalledWith(
    "%Blade!_100!%!!' OR 1=1 --%",
    16,
    4,
    0,
  );
  expect(prisma.$queryRawTyped).toHaveBeenCalledWith({
    query: "one-class",
    parameters: ["%Blade!_100!%!!' OR 1=1 --%", 16, 4, 0],
  });
});

test("normalizes invalid pagination at the query boundary", async () => {
  await getRankings({ page: 0, pageSize: 0 });

  expect(getRankedCharacters).toHaveBeenCalledWith(
    "%%",
    RANKING_PAGE_SIZE + 1,
    0,
  );
});

test("does not query the database when the requested offset is not exact", async () => {
  const result = await getRankings({ page: Number.MAX_SAFE_INTEGER });

  expect(result).toEqual({ characters: [], hasNext: false });
  expect(prisma.$queryRawTyped).not.toHaveBeenCalled();
});
