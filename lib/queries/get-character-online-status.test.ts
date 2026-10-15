import { prisma } from "@/prisma/prisma";
import {
  getCharactersInGame,
  getOnlineCharacterNames,
} from "./get-character-online-status";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    accountCharacter: { findMany: jest.fn() },
    mEMB_STAT: { findMany: jest.fn() },
  },
}));

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.mEMB_STAT.findMany as jest.Mock).mockResolvedValue([
    { memb___id: "acc1" },
  ]);
  (prisma.accountCharacter.findMany as jest.Mock).mockResolvedValue([
    { GameIDC: "Knight" },
  ]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("marks only the character currently in the game", async () => {
  await expect(getOnlineCharacterNames(["Knight", "Mage"])).resolves.toEqual(
    new Set(["Knight"]),
  );
  expect(prisma.mEMB_STAT.findMany).toHaveBeenCalledWith({
    where: { ConnectStat: { not: 0 } },
    select: { memb___id: true },
  });
  expect(prisma.accountCharacter.findMany).toHaveBeenCalledWith({
    where: { Id: { in: ["acc1"] }, GameIDC: { not: null } },
    select: { GameIDC: true },
  });
});

test("returns no names when nobody is connected", async () => {
  (prisma.mEMB_STAT.findMany as jest.Mock).mockResolvedValue([]);

  await expect(getOnlineCharacterNames(["Knight"])).resolves.toEqual(new Set());
  expect(prisma.accountCharacter.findMany).not.toHaveBeenCalled();
});

test("skips the database when there are no names", async () => {
  await expect(getOnlineCharacterNames([])).resolves.toEqual(new Set());
  expect(prisma.mEMB_STAT.findMany).not.toHaveBeenCalled();
  expect(prisma.accountCharacter.findMany).not.toHaveBeenCalled();
});

test("reuses the in-game names until they are five seconds old", async () => {
  await getOnlineCharacterNames(["Knight"]);
  jest.spyOn(Date, "now").mockReturnValue(now + 4_999);

  await expect(getCharactersInGame()).resolves.toEqual(["Knight"]);
  expect(prisma.mEMB_STAT.findMany).toHaveBeenCalledTimes(1);
});

test("reads the in-game names again once they are five seconds old", async () => {
  await getCharactersInGame();
  jest.spyOn(Date, "now").mockReturnValue(now + 5_000);
  (prisma.mEMB_STAT.findMany as jest.Mock).mockResolvedValue([
    { memb___id: "acc2" },
  ]);
  (prisma.accountCharacter.findMany as jest.Mock).mockResolvedValue([
    { GameIDC: "Mage" },
  ]);

  await expect(getOnlineCharacterNames(["Knight", "Mage"])).resolves.toEqual(
    new Set(["Mage"]),
  );
  expect(prisma.mEMB_STAT.findMany).toHaveBeenCalledTimes(2);
});

test("shares one read across overlapping callers", async () => {
  let resolveAccounts: (value: unknown) => void = () => {};
  (prisma.mEMB_STAT.findMany as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveAccounts = resolve;
    }),
  );

  const names = getOnlineCharacterNames(["Knight", "Mage"]);
  const inGame = getCharactersInGame();
  resolveAccounts([{ memb___id: "acc1" }]);

  await expect(Promise.all([names, inGame])).resolves.toEqual([
    new Set(["Knight"]),
    ["Knight"],
  ]);
  expect(prisma.mEMB_STAT.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.accountCharacter.findMany).toHaveBeenCalledTimes(1);
});

test("tries the in-game names again after a read fails", async () => {
  (prisma.mEMB_STAT.findMany as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getCharactersInGame()).rejects.toThrow("db down");

  await expect(getOnlineCharacterNames(["Knight"])).resolves.toEqual(
    new Set(["Knight"]),
  );
  expect(prisma.mEMB_STAT.findMany).toHaveBeenCalledTimes(2);
});
