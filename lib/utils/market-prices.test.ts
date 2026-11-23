import { EMPTY_DEPOSIT_AMOUNTS } from "@/constants/depositable-items";
import { EMPTY_MARKET_PRICES } from "@/constants/market-prices";
import {
  canAffordMarketPrices,
  hasAnyPositiveMarketPrice,
  marketPricesFromListing,
} from "./market-prices";

test("maps a listing's price columns, credits included", () => {
  expect(
    marketPricesFromListing({
      Zen: 500,
      Rena: 0,
      JewelOfBless: 2,
      JewelOfSoul: 0,
      JewelOfLife: 0,
      JewelOfCreation: 0,
      JewelOfChaos: 0,
      Credits: 7,
    }),
  ).toEqual({ ...EMPTY_MARKET_PRICES, zen: 500, jewelOfBless: 2, credits: 7 });
});

test("counts a price in credits alone as a price, and none at all as no price", () => {
  expect(
    hasAnyPositiveMarketPrice({ ...EMPTY_MARKET_PRICES, credits: 1 }),
  ).toBe(true);
  expect(hasAnyPositiveMarketPrice({ ...EMPTY_MARKET_PRICES, zen: 1 })).toBe(
    true,
  );
  expect(hasAnyPositiveMarketPrice(EMPTY_MARKET_PRICES)).toBe(false);
});

test("affords a price only when the deposits and the credits cover every part", () => {
  const price = { ...EMPTY_MARKET_PRICES, zen: 100, credits: 5 };
  const deposits = { ...EMPTY_DEPOSIT_AMOUNTS, zen: 100 };

  expect(canAffordMarketPrices(price, deposits, 5)).toBe(true);
  expect(canAffordMarketPrices(price, deposits, 4)).toBe(false);
  expect(
    canAffordMarketPrices(price, { ...EMPTY_DEPOSIT_AMOUNTS, zen: 99 }, 50),
  ).toBe(false);
  expect(
    canAffordMarketPrices(
      { ...EMPTY_MARKET_PRICES, credits: 3 },
      EMPTY_DEPOSIT_AMOUNTS,
      3,
    ),
  ).toBe(true);
});
