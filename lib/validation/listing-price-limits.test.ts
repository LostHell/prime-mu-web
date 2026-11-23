import { EMPTY_MARKET_PRICES } from "@/constants/market-prices";
import {
  isListingPriceInRange,
  listingPriceLimit,
  MAX_LISTING_CREDITS_PRICE,
  MAX_LISTING_ITEM_PRICE,
  MAX_LISTING_ZEN_PRICE,
} from "./listing-price-limits";

describe("isListingPriceInRange", () => {
  test("accepts amounts within the zen, item and credits caps", () => {
    expect(
      isListingPriceInRange({
        ...EMPTY_MARKET_PRICES,
        zen: MAX_LISTING_ZEN_PRICE,
        jewelOfBless: MAX_LISTING_ITEM_PRICE,
        credits: MAX_LISTING_CREDITS_PRICE,
      }),
    ).toBe(true);
  });

  test("rejects amounts above the item cap", () => {
    expect(
      isListingPriceInRange({
        ...EMPTY_MARKET_PRICES,
        jewelOfBless: MAX_LISTING_ITEM_PRICE + 1,
      }),
    ).toBe(false);
  });

  test("rejects credits above what an account can hold, and negative credits", () => {
    expect(
      isListingPriceInRange({
        ...EMPTY_MARKET_PRICES,
        credits: MAX_LISTING_CREDITS_PRICE + 1,
      }),
    ).toBe(false);
    expect(isListingPriceInRange({ ...EMPTY_MARKET_PRICES, credits: -1 })).toBe(
      false,
    );
  });
});

test("caps credits at what an account can hold, not at the item cap", () => {
  expect(listingPriceLimit("credits")).toBe(2_147_483_647);
  expect(listingPriceLimit("jewelOfSoul")).toBe(MAX_LISTING_ITEM_PRICE);
  expect(listingPriceLimit("zen")).toBe(MAX_LISTING_ZEN_PRICE);
});
