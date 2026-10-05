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
jest.mock("@/prisma/prisma", () => {
  const prisma = {
    character: { updateMany: jest.fn() },
    accountDeposit: { findUnique: jest.fn(), updateMany: jest.fn() },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation((run) => run(prisma));
  return { prisma };
});
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const mockCharacter = (character: {
  PkCount: number;
  PkLevel: number;
  PkTime: number;
  Money: number;
}) => (verifyCharacterOwnership as jest.Mock).mockResolvedValue(character);

const mockDepositZen = (zen: number) =>
  (prisma.accountDeposit.findUnique as jest.Mock).mockResolvedValue({
    Zen: BigInt(zen),
  });

beforeEach(() => {
  jest.clearAllMocks();
  (isAccountOffline as jest.Mock).mockResolvedValue(true);
  mockCharacter({ PkCount: 0, PkLevel: 6, PkTime: 100, Money: 0 });
  (prisma.character.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
  (prisma.accountDeposit.updateMany as jest.Mock).mockResolvedValue({
    count: 1,
  });
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
  expect(prisma.accountDeposit.updateMany).not.toHaveBeenCalled();
});

test("charges the character's zen per PK kill", async () => {
  mockCharacter({ PkCount: 3, PkLevel: 6, PkTime: 0, Money: 200_000_000 });
  expect((await submit()).success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        Money: { decrement: 3 * PK_CLEAR_COST_PER_KILL },
      }),
    }),
  );
  expect(prisma.accountDeposit.updateMany).not.toHaveBeenCalled();
});

test("takes what the character can't cover from the deposited zen", async () => {
  // 100 kills (the most the server counts) cost 2.5 billion, more than a
  // character can hold.
  mockCharacter({
    PkCount: 100,
    PkLevel: 6,
    PkTime: 0,
    Money: 2_000_000_000,
  });
  mockDepositZen(1_000_000_000);
  expect((await submit()).success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ Money: { decrement: 2_000_000_000 } }),
    }),
  );
  expect(prisma.accountDeposit.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "account", Zen: { gte: BigInt(500_000_000) } },
    data: { Zen: { decrement: BigInt(500_000_000) } },
  });
});

test("refuses when the character and deposit together can't pay", async () => {
  // 3 kills cost 75 million.
  mockCharacter({ PkCount: 3, PkLevel: 6, PkTime: 0, Money: 50_000_000 });
  mockDepositZen(24_999_999);
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
