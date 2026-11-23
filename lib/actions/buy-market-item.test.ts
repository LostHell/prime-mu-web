import { buyMarketItemAction } from "./buy-market-item";
import { placeItemInWarehouse } from "./place-warehouse-item";
import { getAuthenticatedUser, isAccountOffline } from "./utils";
import { prisma } from "@/prisma/prisma";

jest.mock("@/prisma/prisma", () => ({
  prisma: { $transaction: jest.fn() },
}));
jest.mock("./utils", () => ({
  getAuthenticatedUser: jest.fn(),
  isAccountOffline: jest.fn(),
  // Prisma's unique-constraint error.
  isUniqueConflict: (err: unknown) =>
    (err as { code?: string } | null)?.code === "P2002",
}));
jest.mock("./place-warehouse-item", () => ({
  placeItemInWarehouse: jest.fn(),
}));
jest.mock("next/cache", () => ({ revalidatePath: jest.fn() }));

const LISTING_ID = 7;

const listing = (fields: Record<string, number | string>) => ({
  id: LISTING_ID,
  sellerAccountId: "seller",
  sellerCharacter: "Seller",
  itemHex: Buffer.alloc(10),
  status: "active",
  Zen: 0,
  Rena: 0,
  JewelOfBless: 0,
  JewelOfSoul: 0,
  JewelOfLife: 0,
  JewelOfCreation: 0,
  JewelOfChaos: 0,
  Credits: 0,
  ...fields,
});

/** A transaction client: the listing, the buyer's character and the balances' answers. */
const transaction = (
  row: ReturnType<typeof listing>,
  {
    depositsDebited = 1,
    creditsDebited = 1,
    upsertCredits = jest.fn().mockResolvedValue({}),
  }: {
    depositsDebited?: number;
    creditsDebited?: number;
    upsertCredits?: jest.Mock;
  } = {},
) => ({
  marketplaceListing: {
    findUnique: jest.fn().mockResolvedValue(row),
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
  },
  character: { findFirst: jest.fn().mockResolvedValue({ Name: "Buyer" }) },
  accountDeposit: {
    updateMany: jest.fn().mockResolvedValue({ count: depositsDebited }),
    upsert: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
  },
  aFK_CreditReward: {
    updateMany: jest.fn().mockResolvedValue({ count: creditsDebited }),
    upsert: upsertCredits,
    update: jest.fn().mockResolvedValue({}),
  },
});

const run = (tx: ReturnType<typeof transaction>) =>
  (prisma.$transaction as jest.Mock).mockImplementation((body) => body(tx));

const buy = () => {
  const form = new FormData();
  form.set("listingId", String(LISTING_ID));
  return buyMarketItemAction({}, form);
};

beforeEach(() => {
  jest.clearAllMocks();
  (getAuthenticatedUser as jest.Mock).mockResolvedValue("buyer");
  (isAccountOffline as jest.Mock).mockResolvedValue(true);
});

test("buys a listing priced in credits only: the buyer's credits go to the seller, the deposits are not touched", async () => {
  const tx = transaction(listing({ Credits: 30 }));
  run(tx);

  const result = await buy();

  expect(result).toEqual({
    success: true,
    message: "Item purchased and added to your warehouse.",
  });
  expect(tx.aFK_CreditReward.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "buyer", Credits: { gte: 30 } },
    data: { Credits: { decrement: 30 } },
  });
  expect(tx.aFK_CreditReward.upsert).toHaveBeenCalledWith({
    where: { AccountID: "seller" },
    create: { AccountID: "seller", Credits: 30 },
    update: { Credits: { increment: 30 } },
  });
  expect(tx.accountDeposit.updateMany).not.toHaveBeenCalled();
  expect(tx.accountDeposit.upsert).not.toHaveBeenCalled();
  expect(placeItemInWarehouse).toHaveBeenCalledWith(
    tx,
    "buyer",
    expect.any(Buffer),
  );
});

test("takes both the zen and the credits of a listing priced in both", async () => {
  const tx = transaction(listing({ Zen: 1_000, Credits: 2 }));
  run(tx);

  expect((await buy()).success).toBe(true);
  expect(tx.accountDeposit.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "buyer", Zen: { gte: BigInt(1_000) } },
    data: { Zen: { decrement: BigInt(1_000) } },
  });
  expect(tx.aFK_CreditReward.updateMany).toHaveBeenCalledWith({
    where: { AccountID: "buyer", Credits: { gte: 2 } },
    data: { Credits: { decrement: 2 } },
  });
  expect(tx.aFK_CreditReward.upsert).toHaveBeenCalled();
});

test("buys nothing when the buyer has too few credits", async () => {
  const tx = transaction(listing({ Credits: 30 }), { creditsDebited: 0 });
  run(tx);

  const result = await buy();

  expect(result).toEqual({
    success: false,
    message: "Not enough credits to buy this item.",
  });
  expect(tx.aFK_CreditReward.upsert).not.toHaveBeenCalled();
  expect(placeItemInWarehouse).not.toHaveBeenCalled();
});

test("buys nothing in credits when the zen part is short", async () => {
  const tx = transaction(listing({ Zen: 1_000, Credits: 2 }), {
    depositsDebited: 0,
  });
  run(tx);

  expect(await buy()).toEqual({
    success: false,
    message: "Not enough deposited funds to buy this item.",
  });
  expect(tx.aFK_CreditReward.updateMany).not.toHaveBeenCalled();
});

test("pays a seller whose credits row appeared meanwhile by updating it", async () => {
  const conflict = Object.assign(new Error("unique"), { code: "P2002" });
  const tx = transaction(listing({ Credits: 5 }), {
    upsertCredits: jest.fn().mockRejectedValue(conflict),
  });
  run(tx);

  expect((await buy()).success).toBe(true);
  expect(tx.aFK_CreditReward.update).toHaveBeenCalledWith({
    where: { AccountID: "seller" },
    data: { Credits: { increment: 5 } },
  });
});

test("refuses the sale when the seller cannot hold more credits", async () => {
  const tx = transaction(listing({ Credits: 5 }), {
    upsertCredits: jest
      .fn()
      .mockRejectedValue(new Error("Out of range value for column 'Credits'")),
  });
  run(tx);

  expect(await buy()).toEqual({
    success: false,
    message: "Seller cannot receive this payment.",
  });
});

test("refuses a listing with no price, the buyer's own listing, a sold one and an online buyer", async () => {
  run(transaction(listing({})));
  expect((await buy()).message).toBe("This listing has no price set.");

  run(transaction(listing({ Credits: 1, sellerAccountId: "buyer" })));
  expect((await buy()).message).toBe("You cannot buy your own listing.");

  run(transaction({ ...listing({ Credits: 1 }), status: "sold" }));
  expect((await buy()).message).toBe("Listing not found or already sold.");

  (isAccountOffline as jest.Mock).mockResolvedValue(false);
  expect((await buy()).message).toBe(
    "Disconnect from game before buying marketplace items.",
  );
});

test("asks a visitor who is not logged in to log in", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValue(null);

  expect(await buy()).toEqual({
    success: false,
    message: "You must be logged in.",
  });
  expect(prisma.$transaction).not.toHaveBeenCalled();
});
