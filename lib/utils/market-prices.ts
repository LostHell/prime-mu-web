import {
  DEPOSIT_ITEM_TYPES,
  type AccountDepositItemFields,
  type DepositAmounts,
} from "@/constants/depositable-items";
import {
  MARKET_PRICE_TYPES,
  type MarketPrices,
} from "@/constants/market-prices";
import { depositAmountsFromColumns } from "./deposits";

/** Maps MarketplaceListing's price columns onto MarketPriceType keys. */
export const marketPricesFromListing = (
  row: { Zen: number | bigint; Credits: number } & AccountDepositItemFields,
): MarketPrices => ({
  ...depositAmountsFromColumns(row),
  credits: row.Credits,
});

export const hasAnyPositiveMarketPrice = (prices: MarketPrices): boolean =>
  MARKET_PRICE_TYPES.some((type) => prices[type] > 0);

/** Whether the deposited balances and the credits cover every part of the price. */
export const canAffordMarketPrices = (
  prices: MarketPrices,
  deposits: DepositAmounts,
  credits: number,
): boolean =>
  DEPOSIT_ITEM_TYPES.every((type) => deposits[type] >= prices[type]) &&
  credits >= prices.credits;
