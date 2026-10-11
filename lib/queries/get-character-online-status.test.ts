import { prisma } from "@/prisma/prisma";
import { getOnlineCharacterNames } from "./get-character-online-status";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    accountCharacter: { findMany: jest.fn() },
    mEMB_STAT: { findMany: jest.fn() },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("marks only the character currently in the game", async () => {
  (prisma.accountCharacter.findMany as jest.Mock).mockResolvedValue([
    { Id: "acc1", GameIDC: "Knight" },
  ]);
  (prisma.mEMB_STAT.findMany as jest.Mock).mockResolvedValue([
    { memb___id: "acc1" },
  ]);

  await expect(getOnlineCharacterNames(["Knight", "Mage"])).resolves.toEqual(
    new Set(["Knight"]),
  );
  expect(prisma.accountCharacter.findMany).toHaveBeenCalledWith({
    where: { GameIDC: { in: ["Knight", "Mage"] } },
    select: { Id: true, GameIDC: true },
  });
});

test("skips a connected account when GameIDC is not one of the names", async () => {
  (prisma.accountCharacter.findMany as jest.Mock).mockResolvedValue([]);

  await expect(getOnlineCharacterNames(["Mage"])).resolves.toEqual(new Set());
  expect(prisma.mEMB_STAT.findMany).not.toHaveBeenCalled();
});

test("skips the database when there are no names", async () => {
  await expect(getOnlineCharacterNames([])).resolves.toEqual(new Set());
  expect(prisma.accountCharacter.findMany).not.toHaveBeenCalled();
});
