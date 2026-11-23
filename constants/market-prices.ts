import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  EMPTY_DEPOSIT_AMOUNTS,
  type DepositAmounts,
  type DepositItemType,
} from "./depositable-items";

/**
 * What a market listing can be priced in: the deposited currencies and the
 * account's credits (AFK_CreditReward.Credits, earned AFK in game). Credits
 * are not a deposit: they are never moved to or from the warehouse.
 */
export type MarketPriceType = DepositItemType | "credits";

/** A listing's price in every currency (0 = not asked). */
export type MarketPrices = DepositAmounts & { credits: number };

/** The order the prices are shown and entered in: zen, credits, then the items. */
export const MARKET_PRICE_TYPES: MarketPriceType[] = [
  "zen",
  "credits",
  ...DEPOSIT_ITEM_TYPES.filter((type) => type !== "zen"),
];

export const EMPTY_MARKET_PRICES: MarketPrices = {
  ...EMPTY_DEPOSIT_AMOUNTS,
  credits: 0,
};

export const CREDITS_LABEL = "Credits";

export const marketPriceLabel = (type: MarketPriceType): string =>
  type === "credits" ? CREDITS_LABEL : DEPOSITABLE_ITEMS[type].label;
