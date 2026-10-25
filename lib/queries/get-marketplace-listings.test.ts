import {
  getAllActiveListings,
  getMyListings,
  getMyPurchases,
} from "./get-marketplace-listings";
import { prisma } from "@/prisma/prisma";
import { MARKET_PAGE_SIZE, MAX_SEARCH_LENGTH } from "@/constants/pagination";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    marketplaceListing: { findMany: jest.fn(), count: jest.fn() },
  },
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

type ListingRow = {
  id: number;
  sellerAccountId: string;
  sellerCharacter: string;
  itemHex: Buffer;
  itemName: string | null;
  Zen: number;
  Rena: number;
  JewelOfBless: number;
  JewelOfSoul: number;
  JewelOfLife: number;
  JewelOfCreation: number;
  JewelOfChaos: number;
  listedAt: Date;
  status: string;
  buyerAccountId: string | null;
  buyerCharacter: string | null;
  soldAt: Date | null;
};

type ListingWhere = {
  status?: string;
  sellerAccountId?: string;
  buyerAccountId?: string;
  itemName?: { contains: string };
};

const listing = (
  id: number,
  itemName: string | null,
  itemIndex = itemName === "Old blade" ? 1 : 0,
): ListingRow => ({
  id,
  sellerAccountId: "private-login",
  sellerCharacter: "Knight",
  itemHex: Buffer.from([itemIndex]),
  itemName,
  Zen: 1,
  Rena: 0,
  JewelOfBless: 0,
  JewelOfSoul: 0,
  JewelOfLife: 0,
  JewelOfCreation: 0,
  JewelOfChaos: 0,
  listedAt: new Date(),
  status: "active",
  buyerAccountId: null,
  buyerCharacter: null,
  soldAt: null,
});

const matchesWhere = (row: ListingRow, where: ListingWhere) => {
  if (where.status && row.status !== where.status) return false;
  if (where.sellerAccountId && row.sellerAccountId !== where.sellerAccountId) {
    return false;
  }
  if (where.buyerAccountId && row.buyerAccountId !== where.buyerAccountId) {
    return false;
  }
  if (where.itemName?.contains) {
    const needle = where.itemName.contains
      .replace(/\\([\\%_])/g, "$1")
      .toLowerCase();
    if (!row.itemName?.toLowerCase().includes(needle)) return false;
  }
  return true;
};

let rows: ListingRow[] = [];

const mockListings = (nextRows: ListingRow[]) => {
  rows = nextRows;
  (prisma.marketplaceListing.count as jest.Mock).mockImplementation(
    ({ where }: { where: ListingWhere }) =>
      Promise.resolve(rows.filter((row) => matchesWhere(row, where)).length),
  );
  (prisma.marketplaceListing.findMany as jest.Mock).mockImplementation(
    ({
      where,
      skip = 0,
      take,
    }: {
      where: ListingWhere;
      skip?: number;
      take: number;
    }) =>
      Promise.resolve(
        rows
          .filter((row) => matchesWhere(row, where))
          .sort((left, right) => right.id - left.id)
          .slice(skip, skip + take),
      ),
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  mockListings(
    Array.from({ length: 151 }, (_, index) =>
      listing(151 - index, index === 150 ? "Old blade" : "Sword"),
    ),
  );
});

test("returns the newest name matches and the filtered total from sql", async () => {
  const result = await getAllActiveListings("buyer", 1, "old blade");

  const where = { status: "active", itemName: { contains: "old blade" } };
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith({
    where,
    orderBy: { id: "desc" },
    skip: 0,
    take: MARKET_PAGE_SIZE,
  });
  expect(prisma.marketplaceListing.count).toHaveBeenCalledWith({ where });
  expect(result.items.map((item) => item.id)).toEqual([1]);
  expect(result.total).toBe(1);
  expect(result.hasNext).toBe(false);
  expect(result.items[0]).not.toHaveProperty("sellerAccountId");
  expect(result.items[0].isOwnListing).toBe(false);
});

test("returns one page of listings and a total across every page", async () => {
  const result = await getAllActiveListings("private-login", 5);

  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledTimes(1);
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { status: "active" },
      orderBy: { id: "desc" },
      skip: 4 * MARKET_PAGE_SIZE,
      take: MARKET_PAGE_SIZE,
    }),
  );
  expect(result.items).toHaveLength(MARKET_PAGE_SIZE);
  expect(result.items[0].id).toBe(51);
  expect(result.items[0].isOwnListing).toBe(true);
  expect(result.total).toBe(151);
  expect(result.hasNext).toBe(true);
});

test("reports the final partial page without a next page", async () => {
  const result = await getAllActiveListings("buyer", 7);

  expect(result.items.map((item) => item.id)).toEqual([1]);
  expect(result.total).toBe(151);
  expect(result.hasNext).toBe(false);
});

test("paginates within the complete filtered result set", async () => {
  const result = await getAllActiveListings("buyer", 2, "sword");

  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { status: "active", itemName: { contains: "sword" } },
      skip: MARKET_PAGE_SIZE,
      take: MARKET_PAGE_SIZE,
    }),
  );
  expect(result.items).toHaveLength(MARKET_PAGE_SIZE);
  expect(result.items[0].id).toBe(126);
  expect(result.items.at(-1)?.id).toBe(102);
  expect(result.total).toBe(150);
  expect(result.hasNext).toBe(true);
});

test("returns an empty page when the offset is not a safe integer", async () => {
  const result = await getAllActiveListings("buyer", Number.MAX_SAFE_INTEGER);

  expect(result).toEqual({ items: [], hasNext: false, total: 0 });
  expect(prisma.marketplaceListing.findMany).not.toHaveBeenCalled();
  expect(prisma.marketplaceListing.count).not.toHaveBeenCalled();
});

test("normalizes invalid page arguments at the query boundary", async () => {
  const result = await getAllActiveListings("buyer", 0);

  expect(result.items[0].id).toBe(151);
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ skip: 0 }),
  );
});

test("trims and limits the search before the sql filter", async () => {
  await getAllActiveListings(
    "buyer",
    1,
    ` ${"a".repeat(MAX_SEARCH_LENGTH + 5)} `,
  );

  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        status: "active",
        itemName: { contains: "a".repeat(MAX_SEARCH_LENGTH) },
      },
    }),
  );
});

test("escapes like wildcards in the search text", async () => {
  await getAllActiveListings("buyer", 1, "  100%_off\\x  ");

  const where = {
    status: "active",
    itemName: { contains: "100\\%\\_off\\\\x" },
  };
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ where }),
  );
  expect(prisma.marketplaceListing.count).toHaveBeenCalledWith({ where });
});

test("keeps listings without a stored name out of a search", async () => {
  mockListings([
    listing(3, null),
    listing(2, "Sword"),
    listing(1, "Old blade"),
  ]);

  const searched = await getAllActiveListings("buyer", 1, "sword");
  expect(searched.items.map((item) => item.id)).toEqual([2]);
  expect(searched.total).toBe(1);
  expect(searched.hasNext).toBe(false);

  const browse = await getAllActiveListings("buyer", 1, "   ");
  expect(browse.items.map((item) => item.id)).toEqual([3, 2, 1]);
  expect(browse.total).toBe(3);
});

test("scopes listed and sold pages to the authenticated seller", async () => {
  await getMyListings("account", "sold", 1);

  const where = { sellerAccountId: "account", status: "sold" };
  expect(prisma.marketplaceListing.count).toHaveBeenCalledWith({ where });
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where,
      orderBy: { id: "desc" },
      take: MARKET_PAGE_SIZE,
    }),
  );
});

test("scopes purchase history to the authenticated buyer", async () => {
  await getMyPurchases("account", 1);

  const where = { buyerAccountId: "account", status: "sold" };
  expect(prisma.marketplaceListing.count).toHaveBeenCalledWith({ where });
  expect(prisma.marketplaceListing.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where,
      orderBy: { id: "desc" },
      take: MARKET_PAGE_SIZE,
    }),
  );
});
