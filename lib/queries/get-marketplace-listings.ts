import "server-only";

import { type DepositAmounts } from "@/constants/depositable-items";
import { MARKET_PAGE_SIZE, MAX_SEARCH_LENGTH } from "@/constants/pagination";
import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemDefinition } from "@/lib/game/item-database/types";
import { decodeItem } from "@/lib/game/item-decoder";
import { type DecodedItem } from "@/lib/game/item-decoder/types";
import { depositAmountsFromColumns } from "@/lib/utils/deposits";
import type {
  MarketplaceListing as MarketplaceListingRow,
  Prisma,
} from "@/prisma/generated/prisma/client";
import { prisma } from "@/prisma/prisma";

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
  item: ListingItem | null;
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
  if (!itemDef) return null;

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

/** `%`, `_`, and `\` are wildcards or the escape character in a SQL LIKE pattern. */
const escapeLikeWildcards = (value: string) =>
  value.replace(/[\\%_]/g, (character) => `\\${character}`);

const toMarketListing = (
  listing: MarketplaceListingRow,
  accountId: string,
): MarketListing => {
  const item = decodeItemFromHex(Buffer.from(listing.itemHex));

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
  filters: Prisma.MarketplaceListingWhereInput,
  page: number,
  query = "",
) {
  const currentPage = Number.isSafeInteger(page) && page > 0 ? page : 1;
  const search = query.trim().slice(0, MAX_SEARCH_LENGTH);
  const skip = (currentPage - 1) * MARKET_PAGE_SIZE;
  if (!Number.isSafeInteger(skip)) {
    return { items: [], hasNext: false, total: 0 };
  }

  const where: Prisma.MarketplaceListingWhereInput = {
    ...filters,
    ...(search ? { itemName: { contains: escapeLikeWildcards(search) } } : {}),
  };
  const total = await prisma.marketplaceListing.count({ where });
  const rows = await prisma.marketplaceListing.findMany({
    where,
    orderBy: { id: "desc" },
    skip,
    take: MARKET_PAGE_SIZE,
  });

  return {
    items: rows.map((row) => toMarketListing(row, accountId)),
    hasNext: total > skip + MARKET_PAGE_SIZE,
    total,
  };
}
