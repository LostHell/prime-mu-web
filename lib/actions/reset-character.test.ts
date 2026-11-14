import { MAX_RESETS, MIN_RESET_LEVEL } from "@/constants/resets";
import { serverConfig } from "@/lib/game/server-config";
import { prisma } from "@/prisma/prisma";
import { resetCharacterAction } from "./reset-character";
import { verifyCharacterOwnership } from "./utils";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/prisma/prisma", () => {
  const client = {
    character: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    defaultClassType: { findUnique: jest.fn().mockResolvedValue({ Level: 1 }) },
    $queryRaw: jest.fn().mockResolvedValue([]),
    $executeRaw: jest.fn().mockResolvedValue(1),
    $transaction: jest.fn(),
  };
  client.$transaction.mockImplementation((run: (tx: unknown) => unknown) =>
    run(client),
  );
  return { prisma: client };
});
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  isAccountOffline: jest.fn().mockResolvedValue(true),
  verifyCharacterOwnership: jest.fn(),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const character = {
  Class: 0,
  cLevel: MIN_RESET_LEVEL,
  ResetCount: 2,
  LevelUpPoint: 0,
  Strength: 10,
  Dexterity: 10,
  Vitality: 10,
  Energy: 10,
  Money: 1_000_000_000,
  Inventory: new Uint8Array(760).fill(255),
  // Quests 0 and 1 finished.
  Quest: Uint8Array.of(0xfa),
  FruitAddPoint: 12,
};

const reset = () => {
  const form = new FormData();
  form.set("characterName", "Wizard");
  return resetCharacterAction({}, form);
};

beforeEach(() => jest.clearAllMocks());

test("keeps quest and fruit points, as the game server's reset does", async () => {
  jest.mocked(verifyCharacterOwnership).mockResolvedValue(character as never);
  const result = await reset();
  expect(result.success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        // Test reset table: 100 + 100 + 200 points for the first three resets.
        LevelUpPoint: 400 + 20 + 12,
        // Third reset's cost in the test reset table.
        Money: { decrement: 3_000 },
      }),
    }),
  );
});

test("rejects a reset the table does not define", async () => {
  const table = serverConfig.reset.table;
  serverConfig.reset.table = table.filter((rule) => rule.reset !== 1);
  jest
    .mocked(verifyCharacterOwnership)
    .mockResolvedValue({ ...character, ResetCount: 0 } as never);
  try {
    const result = await reset();
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/unavailable/);
    expect(prisma.character.updateMany).not.toHaveBeenCalled();
  } finally {
    serverConfig.reset.table = table;
  }
});

test("stops at the server's reset limit", async () => {
  jest
    .mocked(verifyCharacterOwnership)
    .mockResolvedValue({ ...character, ResetCount: MAX_RESETS } as never);
  const result = await reset();
  expect(result.success).toBe(false);
  expect(result.message).toMatch(/reset limit/);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});

describe("a class change (the character deleted and made again with its name)", () => {
  const firstReset = { ...character, ResetCount: 0 };

  test("brings back the resets the deleted character left, with their points", async () => {
    jest
      .mocked(verifyCharacterOwnership)
      .mockResolvedValue(firstReset as never);
    jest.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ Reset: 1 }]);
    const result = await reset();
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/previous character/);
    expect(prisma.character.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ ResetCount: 0 }),
        data: expect.objectContaining({
          // 1 carried + this one: the points of the first two resets.
          ResetCount: 2,
          LevelUpPoint: 200 + 20 + 12,
          // The first reset's cost.
          Money: { decrement: 1_000 },
        }),
      }),
    );
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });

  test("never past the reset limit", async () => {
    jest
      .mocked(verifyCharacterOwnership)
      .mockResolvedValue(firstReset as never);
    jest.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ Reset: 9 }]);
    await reset();
    expect(prisma.character.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ResetCount: MAX_RESETS,
          LevelUpPoint: 400 + 20 + 12,
        }),
      }),
    );
  });

  test("a later reset does not look for them", async () => {
    jest.mocked(verifyCharacterOwnership).mockResolvedValue(character as never);
    await reset();
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.character.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ResetCount: 3 }),
      }),
    );
  });

  test("none left: a plain first reset", async () => {
    jest
      .mocked(verifyCharacterOwnership)
      .mockResolvedValue(firstReset as never);
    const result = await reset();
    expect(result.success).toBe(true);
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
    expect(prisma.character.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ResetCount: 1,
          LevelUpPoint: 100 + 20 + 12,
        }),
      }),
    );
  });

  test("taken meanwhile: the reset is undone", async () => {
    jest
      .mocked(verifyCharacterOwnership)
      .mockResolvedValue(firstReset as never);
    jest.mocked(prisma.$queryRaw).mockResolvedValueOnce([{ Reset: 1 }]);
    jest.mocked(prisma.$executeRaw).mockResolvedValueOnce(0);
    const result = await reset();
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/changed while resetting/);
  });
});
