import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemDefinition } from "@/lib/game/item-database/types";
import { decodeItem } from "@/lib/game/item-decoder";
import { type DecodedItem } from "@/lib/game/item-decoder/types";
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
  sellerAccountId: string;
  sellerCharacter: string;
  item: ListingItem;
  zenPrice: number | null;
  listedAt: Date;
  status: string;
  buyerCharacter: string | null;
  soldAt: Date | null;
};

function decodeItemFromHex(itemHex: Buffer): ListingItem | null {
  const decodedItem = decodeItem(itemHex);
  if (!decodedItem) return null;
  const def = getItemDefinition(decodedItem.group, decodedItem.index);

  return {
    ...decodedItem,
    slot: 0,
    name: def?.name ?? "Unknown item",
    width: def?.width ?? 1,
    height: def?.height ?? 1,
    defense: def?.defense,
    defRate: def?.defRate,
    dmgMin: def?.dmgMin,
    dmgMax: def?.dmgMax,
    reqStr: def?.reqStr,
    reqAgi: def?.reqAgi,
    classFlags: def?.classFlags,
  };
}

export async function getMyListings(
  accountId: string,
  status?: string,
): Promise<MarketListing[]> {
  const listings = await prisma.marketplaceListing.findMany({
    where: {
      sellerAccountId: accountId,
      ...(status ? { status } : {}),
    },
    orderBy: { listedAt: "desc" },
  });

  return listings
    .map((listing) => {
      const item = decodeItemFromHex(Buffer.from(listing.itemHex));
      if (!item) return null;

      return {
        id: listing.id,
        sellerAccountId: listing.sellerAccountId,
        sellerCharacter: listing.sellerCharacter,
        item,
        zenPrice: listing.zenPrice,
        listedAt: listing.listedAt,
        status: listing.status,
        buyerCharacter: listing.buyerCharacter,
        soldAt: listing.soldAt,
      };
    })
    .filter((l): l is MarketListing => l !== null);
}

export async function getAllActiveListings(): Promise<MarketListing[]> {
  const listings = await prisma.marketplaceListing.findMany({
    where: { status: "active" },
    orderBy: { listedAt: "desc" },
    take: 100,
  });

  return listings
    .map((listing) => {
      const item = decodeItemFromHex(Buffer.from(listing.itemHex));
      if (!item) return null;

      return {
        id: listing.id,
        sellerAccountId: listing.sellerAccountId,
        sellerCharacter: listing.sellerCharacter,
        item,
        zenPrice: listing.zenPrice,
        listedAt: listing.listedAt,
        status: listing.status,
        buyerCharacter: listing.buyerCharacter,
        soldAt: listing.soldAt,
      };
    })
    .filter((l): l is MarketListing => l !== null);
}

export async function getMyPurchases(
  accountId: string,
): Promise<MarketListing[]> {
  const listings = await prisma.marketplaceListing.findMany({
    where: {
      buyerAccountId: accountId,
      status: "sold",
    },
    orderBy: { soldAt: "desc" },
  });

  return listings
    .map((listing) => {
      const item = decodeItemFromHex(Buffer.from(listing.itemHex));
      if (!item) return null;

      return {
        id: listing.id,
        sellerAccountId: listing.sellerAccountId,
        sellerCharacter: listing.sellerCharacter,
        item,
        zenPrice: listing.zenPrice,
        listedAt: listing.listedAt,
        status: listing.status,
        buyerCharacter: listing.buyerCharacter,
        soldAt: listing.soldAt,
      };
    })
    .filter((l): l is MarketListing => l !== null);
}
