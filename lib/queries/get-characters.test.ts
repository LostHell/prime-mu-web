import { prisma } from "@/prisma/prisma";
import { getCharacters } from "./get-characters";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    character: { findMany: jest.fn() },
    guildMember: { findMany: jest.fn() },
    mEMB_STAT: { findUnique: jest.fn() },
    defaultClassType: { findMany: jest.fn() },
  },
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  jest.clearAllMocks();
  (prisma.character.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.defaultClassType.findMany as jest.Mock).mockResolvedValue([]);
});

test("reads the account status before class defaults", async () => {
  let releaseStatus: (value: unknown) => void = () => {};
  (prisma.mEMB_STAT.findUnique as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      releaseStatus = resolve;
    }),
  );

  const pending = getCharacters("acc");
  await flush();

  expect(prisma.mEMB_STAT.findUnique).toHaveBeenCalledTimes(1);
  expect(prisma.defaultClassType.findMany).not.toHaveBeenCalled();

  releaseStatus({ ConnectStat: 0 });
  await expect(pending).resolves.toMatchObject({
    account: { isOffline: true },
    characters: [],
  });
  expect(prisma.defaultClassType.findMany).toHaveBeenCalledTimes(1);
});
