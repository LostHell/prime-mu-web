import {
  MARKET_PRICE_TYPES,
  type MarketPriceType,
  type MarketPrices,
} from "@/constants/market-prices";

export const MAX_LISTING_ZEN_PRICE = 2_000_000_000;
export const MAX_LISTING_ITEM_PRICE = 10_000;
/**
 * No price cap of its own: the most credits an account can hold
 * (AFK_CreditReward.Credits is a signed INT), so a seller can always be paid.
 */
export const MAX_LISTING_CREDITS_PRICE = 2_147_483_647;

export const listingPriceLimit = (type: MarketPriceType): number => {
  if (type === "zen") return MAX_LISTING_ZEN_PRICE;
  if (type === "credits") return MAX_LISTING_CREDITS_PRICE;
  return MAX_LISTING_ITEM_PRICE;
};

export const isListingPriceInRange = (prices: MarketPrices): boolean =>
  MARKET_PRICE_TYPES.every(
    (type) => prices[type] >= 0 && prices[type] <= listingPriceLimit(type),
  );
