import {
  DEPOSIT_ITEM_TYPES,
  type DepositAmounts,
  type DepositItemType,
} from "@/constants/depositable-items";

export const MAX_LISTING_ZEN_PRICE = 2_000_000_000;
export const MAX_LISTING_ITEM_PRICE = 10_000;

export const listingPriceLimit = (type: DepositItemType): number =>
  type === "zen" ? MAX_LISTING_ZEN_PRICE : MAX_LISTING_ITEM_PRICE;

export const isListingPriceInRange = (prices: DepositAmounts): boolean =>
  DEPOSIT_ITEM_TYPES.every(
    (type) => prices[type] >= 0 && prices[type] <= listingPriceLimit(type),
  );
