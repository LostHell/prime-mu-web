import { clearPkAction } from "./clear-pk";
import { isAccountOffline, verifyCharacterOwnership } from "./utils";
import { prisma } from "@/prisma/prisma";
import {
  NEUTRAL_PK_LEVEL,
  PK_CLEAR_COST_PER_KILL,
} from "@/constants/character-rules";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  isAccountOffline: jest.fn(),
  verifyCharacterOwnership: jest.fn(),
}));
jest.mock("@/prisma/prisma", () => ({
  prisma: { character: { updateMany: jest.fn() } },
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockCharacter = (character: {
  PkCount: number;
  PkLevel: number;
  PkTime: number;
  Money: number;
}) => (verifyCharacterOwnership as jest.Mock).mockResolvedValue(character);

beforeEach(() => {
  jest.clearAllMocks();
  (isAccountOffline as jest.Mock).mockResolvedValue(true);
  mockCharacter({ PkCount: 0, PkLevel: 6, PkTime: 100, Money: 0 });
  (prisma.character.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
});
const submit = () => {
  const form = new FormData();
  form.set("characterName", "Knight");
  return clearPkAction({}, form);
};

test("clears remaining penalties for free when the kill count is zero", async () => {
  expect((await submit()).success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: {
        PkCount: 0,
        PkLevel: NEUTRAL_PK_LEVEL,
        PkTime: 0,
        Money: { decrement: 0 },
      },
    }),
  );
});

test("charges the character's zen per PK kill", async () => {
  // 100 kills (the most the server counts) cost 1.5 billion in the test config.
  mockCharacter({ PkCount: 100, PkLevel: 6, PkTime: 0, Money: 2_000_000_000 });
  expect((await submit()).success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        Money: { gte: 100 * PK_CLEAR_COST_PER_KILL },
      }),
      data: expect.objectContaining({
        Money: { decrement: 100 * PK_CLEAR_COST_PER_KILL },
      }),
    }),
  );
});

test("refuses when the character's zen can't pay", async () => {
  // 3 kills cost 45 million in the test config.
  mockCharacter({ PkCount: 3, PkLevel: 6, PkTime: 0, Money: 44_999_999 });
  const result = await submit();
  expect(result.success).toBe(false);
  expect(result.message).toMatch(/Not enough Zen/);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});

test("does not change a character while the account is online", async () => {
  (isAccountOffline as jest.Mock).mockResolvedValue(false);
  expect((await submit()).success).toBe(false);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});
