import { addStatsAction } from "./add-stats";
import { getMaxStatPoint } from "@/lib/game/characters/stat-limits";
import { prisma } from "@/prisma/prisma";
import { verifyCharacterOwnership } from "./utils";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/prisma/prisma", () => ({
  prisma: {
    mEMB_STAT: { findUnique: jest.fn().mockResolvedValue({ ConnectStat: 0 }) },
    character: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
  },
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  verifyCharacterOwnership: jest.fn(),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const maxStrength = getMaxStatPoint(0, "str");

const addStats = (str: number) => {
  const form = new FormData();
  form.set("characterName", "Knight");
  form.set("str", String(str));
  return addStatsAction({}, form);
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(verifyCharacterOwnership).mockResolvedValue({
    Class: 0,
    LevelUpPoint: 100,
    Strength: maxStrength - 5,
    Dexterity: 10,
    Vitality: 10,
    Energy: 10,
    ResetCount: 0,
  } as never);
});

test("rejects points that would take a stat past what the class can reach", async () => {
  const result = await addStats(6);
  expect(result.success).toBe(false);
  expect(result.errors?.str).toEqual([result.message]);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});

test("allows raising a stat up to what the class can reach", async () => {
  const result = await addStats(5);
  expect(result.success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ Strength: maxStrength }),
    }),
  );
});
