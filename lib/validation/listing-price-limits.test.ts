import { EMPTY_DEPOSIT_AMOUNTS } from "@/constants/depositable-items";
import {
  isListingPriceInRange,
  MAX_LISTING_ITEM_PRICE,
  MAX_LISTING_ZEN_PRICE,
} from "./listing-price-limits";

describe("isListingPriceInRange", () => {
  test("accepts amounts within the zen and item caps", () => {
    expect(
      isListingPriceInRange({
        ...EMPTY_DEPOSIT_AMOUNTS,
        zen: MAX_LISTING_ZEN_PRICE,
        jewelOfBless: MAX_LISTING_ITEM_PRICE,
      }),
    ).toBe(true);
  });

  test("rejects amounts above the item cap", () => {
    expect(
      isListingPriceInRange({
        ...EMPTY_DEPOSIT_AMOUNTS,
        jewelOfBless: MAX_LISTING_ITEM_PRICE + 1,
      }),
    ).toBe(false);
  });
});
