import {
  getAllActiveListings,
  getMyListings,
  getMyPurchases,
} from "./get-marketplace-listings";
import { prisma } from "@/prisma/prisma";
import { MARKET_PAGE_SIZE } from "@/constants/pagination";

jest.mock("@/prisma/prisma", () => ({
  prisma: { marketplaceListing: { findMany: jest.fn() } },
}));
jest.mock("@/lib/game/item-decoder", () => ({
  decodeItem: (bytes: Buffer) => ({ group: 0, index: bytes[0], level: 0 }),
}));
jest.mock("@/lib/game/item-database", () => ({
  getItemDefinition: ({ index }: { index: number }) => ({
    name: index === 1 ? "Old blade" : "Sword",
    width: 1,
    height: 1,
  }),
}));

beforeEach(() => {
  const rows = Array.from({ length: 151 }, (_, index) => ({
    id: 151 - index,
    sellerAccountId: "private-login",
    sellerCharacter: "Knight",
    itemHex: Buffer.from([index === 150 ? 1 : 0]),
    Zen: 1,
    Rena: 0,
    JewelOfBless: 0,
    JewelOfSoul: 0,
    JewelOfLife: 0,
    JewelOfCreation: 0,
    JewelOfChaos: 0,
    listedAt: new Date(),
    status: "active",
    buyerCharacter: null,
    soldAt: null,
  }));
  (prisma.marketplaceListing.findMany as jest.Mock).mockImplementation(
    ({ where, take }) =>
      Promise.resolve(
        rows.filter((row) => !where.id || row.id < where.id.lt).slice(0, take),
      ),
  );
});

test("searches beyond the newest hundred listings without exposing seller logins", async () => {
  const result = await getAllActiveListings("buyer", 1, "old blade");
  expect(result.items.map((item) => item.id)).toEqual([1]);
  expect(result.hasNext).toBe(false);
  expect(result.items[0]).not.toHaveProperty("sellerAccountId");
  expect(result.items[0].isOwnListing).toBe(false);
});

test("makes older pages reachable with stable ordering and a bounded response", async () => {
  const result = await getAllActiveListings("private-login", 5);
  expect(result.items).toHaveLength(MARKET_PAGE_SIZE);
  expect(result.items[0].id).toBe(51);
  expect(result.items[0].isOwnListing).toBe(true);
  expect(result.hasNext).toBe(true);
});

test("reports the final partial page without a next page", async () => {
  const result = await getAllActiveListings("buyer", 7);
  expect(result.items.map((item) => item.id)).toEqual([1]);
  expect(result.hasNext).toBe(false);
});

test("paginates within the complete filtered result set", async () => {
  const result = await getAllActiveListings("buyer", 2, "sword");
  expect(result.items).toHaveLength(MARKET_PAGE_SIZE);
  expect(result.items[0].id).toBe(126);
  expect(result.items.at(-1)?.id).toBe(102);
  expect(result.hasNext).toBe(true);
});

test("normalizes invalid page arguments at the query boundary", async () => {
  const result = await getAllActiveListings("buyer", 0);
  expect(result.items[0].id).toBe(151);
});

test("scopes listed and sold pages to the authenticated seller", async () => {
  await getMyListings("account", "sold", 1);

  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        sellerAccountId: "account",
        status: "sold",
      }),
    }),
  );
});

test("scopes purchase history to the authenticated buyer", async () => {
  await getMyPurchases("account", 1);

  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        buyerAccountId: "account",
        status: "sold",
      }),
    }),
  );
});
