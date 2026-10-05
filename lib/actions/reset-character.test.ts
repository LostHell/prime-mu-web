import { resetCharacterAction } from "./reset-character";
import { MAX_RESETS, MIN_RESET_LEVEL } from "@/constants/resets";
import { prisma } from "@/prisma/prisma";
import { verifyCharacterOwnership } from "./utils";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/prisma/prisma", () => ({
  prisma: {
    mEMB_STAT: { findUnique: jest.fn().mockResolvedValue({ ConnectStat: 0 }) },
    character: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    defaultClassType: { findUnique: jest.fn().mockResolvedValue({ Level: 1 }) },
  },
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
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

test("stops at the server's reset limit", async () => {
  jest
    .mocked(verifyCharacterOwnership)
    .mockResolvedValue({ ...character, ResetCount: MAX_RESETS } as never);
  const result = await reset();
  expect(result.success).toBe(false);
  expect(result.message).toMatch(/reset limit/);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});
