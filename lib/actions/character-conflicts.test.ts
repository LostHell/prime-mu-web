import { addStatsAction } from "./add-stats";
import { resetCharacterAction } from "./reset-character";
import { prisma } from "@/prisma/prisma";
import { MIN_RESET_LEVEL } from "@/constants/resets";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    mEMB_STAT: { findUnique: jest.fn().mockResolvedValue({ ConnectStat: 0 }) },
    character: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
    defaultClassType: {
      findUnique: jest.fn().mockResolvedValue({ Level: 1, LevelUpPoint: 0 }),
    },
  },
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  verifyCharacterOwnership: jest.fn().mockImplementation(() =>
    Promise.resolve({
      Class: 0,
      cLevel: MIN_RESET_LEVEL,
      ResetCount: 0,
      LevelUpPoint: 20,
      Strength: 10,
      Dexterity: 10,
      Vitality: 10,
      Energy: 10,
      Money: 1000000000,
      Inventory: new Uint8Array(760).fill(255),
      Quest: null,
      FruitAddPoint: 0,
    }),
  ),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

test.each([addStatsAction, resetCharacterAction])(
  "reports a concurrent character change instead of reporting false success",
  async (action) => {
    jest.clearAllMocks();
    const form = new FormData();
    form.set("characterName", "Knight");
    form.set("str", "5");
    const result = await action({}, form);
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/character changed/);
    expect(prisma.character.updateMany).toHaveBeenCalledTimes(1);
    if (action === resetCharacterAction) {
      const [{ data }] = jest.mocked(prisma.character.updateMany).mock.calls[0];
      expect(data).toEqual(
        expect.objectContaining({
          LevelUpPoint: expect.any(Number),
        }),
      );
      expect(Number.isFinite(data.LevelUpPoint)).toBe(true);
    }
  },
);
