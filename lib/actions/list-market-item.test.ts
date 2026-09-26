import { listMarketItemAction } from "./list-market-item";
import { prisma } from "@/prisma/prisma";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    character: { findFirst: jest.fn().mockResolvedValue({ Name: "Knight" }) },
    $transaction: jest.fn(),
  },
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  isAccountOffline: jest.fn().mockResolvedValue(true),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

test("refuses to list a replacement item from a stale warehouse tab", async () => {
  const updateMany = jest.fn();
  const create = jest.fn();
  const transaction = {
    warehouse: {
      findUnique: jest.fn().mockResolvedValue({
        Items: Buffer.from("0102030405060708090a", "hex"),
      }),
      updateMany,
    },
    marketplaceListing: { create },
  };
  (prisma.$transaction as jest.Mock).mockImplementation((run) =>
    run(transaction),
  );
  const form = new FormData();
  form.set("slotIndex", "0");
  form.set("zen", "100");
  form.set("itemSerial", "168496141");
  const result = await listMarketItemAction({}, form);
  expect(result.success).toBe(false);
  expect(result.message).toMatch(/changed since you selected/);
  expect(updateMany).not.toHaveBeenCalled();
  expect(create).not.toHaveBeenCalled();
});
