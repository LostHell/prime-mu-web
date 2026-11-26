import { listMarketItemAction } from "./list-market-item";
import { createItemBytes } from "@/lib/game/item-decoder/encode";
import { getItemSerial } from "@/lib/game/item-decoder/decode";
import { prisma } from "@/prisma/prisma";
import { sendGlobalNotice } from "@/lib/game/data-server";
import {
  ANNOUNCEMENT_FEE_CREDITS,
  LISTING_FEE_CREDITS,
} from "@/constants/market-fees";

/** What a listing costs with the announcement. */
const ANNOUNCED_FEE_CREDITS = LISTING_FEE_CREDITS + ANNOUNCEMENT_FEE_CREDITS;

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    character: { findFirst: jest.fn().mockResolvedValue({ Name: "Knight" }) },
    aFK_CreditReward: { update: jest.fn() },
    $transaction: jest.fn(),
  },
}));
jest.mock("@/lib/game/data-server", () => ({
  NOTICE_BLUE: 1,
  sendGlobalNotice: jest.fn().mockResolvedValue(true),
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn().mockResolvedValue("account"),
  isAccountOffline: jest.fn().mockResolvedValue(true),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

/** The account's credits cover the fee. */
const paidFee = () => ({
  updateMany: jest.fn().mockResolvedValue({ count: 1 }),
});

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
    aFK_CreditReward: paidFee(),
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
    aFK_CreditReward: paidFee(),
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

test("stores a price in credits, alone or with zen", async () => {
  const itemBytes = createItemBytes(
    { group: 14, index: 13, level: 0 },
    0x0005e79d,
    1,
  );
  const create = jest.fn().mockResolvedValue({ id: 1 });
  const transaction = {
    warehouse: {
      findUnique: jest.fn().mockResolvedValue({
        Items: Buffer.from(itemBytes),
      }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    marketplaceListing: { create },
    aFK_CreditReward: paidFee(),
  };
  (prisma.$transaction as jest.Mock).mockImplementation((run) =>
    run(transaction),
  );
  const serial = String(getItemSerial(Uint8Array.from(itemBytes)));

  const creditsOnly = new FormData();
  creditsOnly.set("slotIndex", "0");
  creditsOnly.set("credits", "40");
  creditsOnly.set("itemSerial", serial);
  expect((await listMarketItemAction({}, creditsOnly)).success).toBe(true);
  expect(create).toHaveBeenLastCalledWith({
    data: expect.objectContaining({ Zen: 0, Credits: 40 }),
  });

  const withZen = new FormData();
  withZen.set("slotIndex", "0");
  withZen.set("zen", "500");
  withZen.set("credits", "2");
  withZen.set("itemSerial", serial);
  expect((await listMarketItemAction({}, withZen)).success).toBe(true);
  expect(create).toHaveBeenLastCalledWith({
    data: expect.objectContaining({ Zen: 500, Credits: 2 }),
  });
});

/** A Kris +9 in slot 0 of the warehouse, and a form that lists it for 100 zen. */
const listKris = (announce: boolean) => {
  const itemBytes = createItemBytes(
    { group: 0, index: 0, level: 9 },
    0x0005e79d,
    1,
  );
  const credits = paidFee();
  const create = jest.fn().mockResolvedValue({ id: 1 });
  const warehouseUpdate = jest.fn().mockResolvedValue({ count: 1 });
  (prisma.$transaction as jest.Mock).mockImplementation((run) =>
    run({
      warehouse: {
        findUnique: jest.fn().mockResolvedValue({
          Items: Buffer.from(itemBytes),
        }),
        updateMany: warehouseUpdate,
      },
      marketplaceListing: { create },
      aFK_CreditReward: credits,
    }),
  );
  const form = new FormData();
  form.set("slotIndex", "0");
  form.set("zen", "100");
  form.set("itemSerial", String(getItemSerial(Uint8Array.from(itemBytes))));
  if (announce) form.set("announce", "on");
  return { form, credits, create, warehouseUpdate };
};

beforeEach(() => {
  (sendGlobalNotice as jest.Mock).mockClear().mockResolvedValue(true);
  (prisma.aFK_CreditReward.update as jest.Mock).mockClear();
});

test("takes the listing fee and announces nothing", async () => {
  const { form, credits } = listKris(false);

  const result = await listMarketItemAction({}, form);

  expect(result).toEqual({
    success: true,
    message: "Item listed on the marketplace.",
  });
  expect(credits.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "account", Credits: { gte: LISTING_FEE_CREDITS } },
    data: { Credits: { decrement: LISTING_FEE_CREDITS } },
  });
  expect(sendGlobalNotice).not.toHaveBeenCalled();
});

test("takes the listing and announcement fees and tells the game who sells what, without the price", async () => {
  const { form, credits } = listKris(true);

  const result = await listMarketItemAction({}, form);

  expect(result).toEqual({
    success: true,
    message: "Item listed on the marketplace and announced in the game.",
  });
  expect(credits.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "account", Credits: { gte: ANNOUNCED_FEE_CREDITS } },
    data: { Credits: { decrement: ANNOUNCED_FEE_CREDITS } },
  });
  expect(sendGlobalNotice).toHaveBeenCalledWith(
    "[Market] Knight sells Kris +9",
    1,
  );
  expect(prisma.aFK_CreditReward.update).not.toHaveBeenCalled();
});

test("lists nothing when the credits do not cover the fee", async () => {
  const { form, credits, create, warehouseUpdate } = listKris(true);
  credits.updateMany.mockResolvedValue({ count: 0 });

  const result = await listMarketItemAction({}, form);

  expect(result).toEqual({
    success: false,
    message: `Listing this item costs ${ANNOUNCED_FEE_CREDITS} credits, and you do not have enough.`,
  });
  expect(warehouseUpdate).not.toHaveBeenCalled();
  expect(create).not.toHaveBeenCalled();
  expect(sendGlobalNotice).not.toHaveBeenCalled();
});

test("keeps the listing but gives the announcement's credits back when the game cannot be reached", async () => {
  const { form, create } = listKris(true);
  (sendGlobalNotice as jest.Mock).mockResolvedValue(false);

  const result = await listMarketItemAction({}, form);

  expect(result.success).toBe(true);
  expect(result.message).toContain(
    `so its ${ANNOUNCEMENT_FEE_CREDITS} credits were given back`,
  );
  expect(create).toHaveBeenCalled();
  expect(prisma.aFK_CreditReward.update).toHaveBeenCalledWith({
    where: { AccountID: "account" },
    data: { Credits: { increment: ANNOUNCEMENT_FEE_CREDITS } },
  });
});
