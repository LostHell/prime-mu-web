import { clearPkAction } from "./clear-pk";
import { isAccountOffline, verifyCharacterOwnership } from "./utils";
import { prisma } from "@/prisma/prisma";
import { NEUTRAL_PK_LEVEL } from "@/constants/character-rules";

jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  isAccountOffline: jest.fn(),
  verifyCharacterOwnership: jest.fn(),
}));
jest.mock("@/prisma/prisma", () => ({
  prisma: { character: { updateMany: jest.fn() } },
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  (isAccountOffline as jest.Mock).mockResolvedValue(true);
  (verifyCharacterOwnership as jest.Mock).mockResolvedValue({
    PkCount: 0,
    PkLevel: 6,
    PkTime: 100,
  });
  (prisma.character.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
});
const submit = () => {
  const form = new FormData();
  form.set("characterName", "Knight");
  return clearPkAction({}, form);
};

test("clears remaining penalties even when the kill count is zero", async () => {
  expect((await submit()).success).toBe(true);
  expect(prisma.character.updateMany).toHaveBeenCalledWith(
    expect.objectContaining({
      data: { PkCount: 0, PkLevel: NEUTRAL_PK_LEVEL, PkTime: 0 },
    }),
  );
});
test("does not change a character while the account is online", async () => {
  (isAccountOffline as jest.Mock).mockResolvedValue(false);
  expect((await submit()).success).toBe(false);
  expect(prisma.character.updateMany).not.toHaveBeenCalled();
});
