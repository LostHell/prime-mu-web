import { listMarketItemAction } from "./list-market-item";
import { createItemBytes } from "@/lib/game/item-decoder/encode";
import { getItemSerial } from "@/lib/game/item-decoder/decode";
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

test("stores the searchable item name when a listing is created", async () => {
  const itemBytes = createItemBytes(
    { group: 14, index: 13, level: 0 },
    0x0005e79d,
    1,
  );
  const updateMany = jest.fn().mockResolvedValue({ count: 1 });
  const create = jest.fn().mockResolvedValue({ id: 1 });
  const transaction = {
    warehouse: {
      findUnique: jest.fn().mockResolvedValue({
        Items: Buffer.from(itemBytes),
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
  form.set("itemSerial", String(getItemSerial(Uint8Array.from(itemBytes))));
  const result = await listMarketItemAction({}, form);

  expect(result.success).toBe(true);
  expect(create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      sellerAccountId: "account",
      sellerCharacter: "Knight",
      itemName: "Jewel of Bless",
    }),
  });
});
