import { prisma } from "@/prisma/prisma";
import { getAccountCredits } from "./get-credits";

jest.mock("@/prisma/prisma", () => ({
  prisma: { aFK_CreditReward: { findUnique: jest.fn() } },
}));

test("reads the account's credits", async () => {
  (prisma.aFK_CreditReward.findUnique as jest.Mock).mockResolvedValue({
    Credits: 42,
  });

  expect(await getAccountCredits("acc")).toBe(42);
  expect(prisma.aFK_CreditReward.findUnique).toHaveBeenCalledWith({
    where: { AccountID: "acc" },
    select: { Credits: true },
  });
});

test("has no credits for an account without a row yet", async () => {
  (prisma.aFK_CreditReward.findUnique as jest.Mock).mockResolvedValue(null);

  expect(await getAccountCredits("acc")).toBe(0);
});
