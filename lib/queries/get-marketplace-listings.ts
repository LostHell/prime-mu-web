import { type DepositAmounts } from "@/constants/depositable-items";
import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemDefinition } from "@/lib/game/item-database/types";
import { decodeItem } from "@/lib/game/item-decoder";
import { type DecodedItem } from "@/lib/game/item-decoder/types";
import { depositAmountsFromColumns } from "@/lib/utils/deposits";
import type { MarketplaceListing as MarketplaceListingRow } from "@/prisma/generated/prisma/client";
import { prisma } from "@/prisma/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";
import {
  MARKET_PAGE_SIZE,
  MARKET_SCAN_BATCH_SIZE,
  MAX_SEARCH_LENGTH,
} from "@/constants/pagination";

export type ListingItem = DecodedItem &
  Pick<
    ItemDefinition,
    | "defense"
    | "defRate"
    | "dmgMin"
    | "dmgMax"
    | "reqStr"
    | "reqAgi"
    | "classFlags"
  > & {
    name: string;
    width: number;
    height: number;
  };

export type MarketListing = {
  id: number;
  isOwnListing: boolean;
  sellerCharacter: string;
  item: ListingItem;
  prices: DepositAmounts;
  listedAt: Date;
  status: string;
  buyerCharacter: string | null;
  soldAt: Date | null;
};

const decodeItemFromHex = (itemHex: Buffer): ListingItem | null => {
  const decodedItem = decodeItem(itemHex);
  if (!decodedItem) return null;
  const itemDef = getItemDefinition({
    group: decodedItem.group,
    index: decodedItem.index,
    level: decodedItem.level,
  });

  return {
    ...decodedItem,
    slot: 0,
    name: itemDef?.name ?? "Unknown item",
    width: itemDef?.width ?? 1,
    height: itemDef?.height ?? 1,
    defense: itemDef?.defense,
    defRate: itemDef?.defRate,
    dmgMin: itemDef?.dmgMin,
    dmgMax: itemDef?.dmgMax,
    reqStr: itemDef?.reqStr,
    reqAgi: itemDef?.reqAgi,
    classFlags: itemDef?.classFlags,
  };
};

const toMarketListing = (
  listing: MarketplaceListingRow,
  accountId: string,
): MarketListing | null => {
  const item = decodeItemFromHex(Buffer.from(listing.itemHex));
  if (!item) return null;

  return {
    id: listing.id,
    isOwnListing: listing.sellerAccountId === accountId,
    sellerCharacter: listing.sellerCharacter,
    item,
    prices: depositAmountsFromColumns(listing),
    listedAt: listing.listedAt,
    status: listing.status,
    buyerCharacter: listing.buyerCharacter,
    soldAt: listing.soldAt,
  };
};

export async function getMyListings(
  accountId: string,
  status?: string,
  page = 1,
) {
  return getListingPage(
    accountId,
    {
      sellerAccountId: accountId,
      ...(status ? { status } : {}),
    },
    page,
  );
}

export async function getAllActiveListings(
  accountId: string,
  page = 1,
  query = "",
) {
  return getListingPage(accountId, { status: "active" }, page, query);
}

export async function getMyPurchases(accountId: string, page = 1) {
  return getListingPage(
    accountId,
    {
      buyerAccountId: accountId,
      status: "sold",
    },
    page,
  );
}

async function getListingPage(
  accountId: string,
  where: Prisma.MarketplaceListingWhereInput,
  page: number,
  query = "",
) {
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const search = query.trim().slice(0, MAX_SEARCH_LENGTH).toLowerCase();
  const items: MarketListing[] = [];
  let beforeId: number | undefined;
  let matched = 0;
  const skip = (currentPage - 1) * MARKET_PAGE_SIZE;
  // Names are decoded from game bytes, not a database text column. Scan bounded
  // batches so searching includes older listings without loading the catalogue into memory.
  while (items.length <= MARKET_PAGE_SIZE) {
    const rows = await prisma.marketplaceListing.findMany({
      where: {
        ...where,
        ...(beforeId === undefined ? {} : { id: { lt: beforeId } }),
      },
      orderBy: { id: "desc" },
      take: MARKET_SCAN_BATCH_SIZE,
    });
    for (const row of rows) {
      const listing = toMarketListing(row, accountId);
      if (!listing || !listing.item.name.toLowerCase().includes(search))
        continue;
      if (matched++ < skip) continue;
      items.push(listing);
      if (items.length > MARKET_PAGE_SIZE) break;
    }
    if (rows.length < MARKET_SCAN_BATCH_SIZE || items.length > MARKET_PAGE_SIZE)
      break;
    beforeId = rows[rows.length - 1].id;
  }
  return {
    items: items.slice(0, MARKET_PAGE_SIZE),
    hasNext: items.length > MARKET_PAGE_SIZE,
  };
}
