import { EMPTY_MARKET_PRICES } from "@/constants/market-prices";
import { formatNumber } from "@/lib/utils/numbers";
import {
  MAX_LISTING_CREDITS_PRICE,
  MAX_LISTING_ITEM_PRICE,
  MAX_LISTING_ZEN_PRICE,
} from "@/lib/validation/listing-price-limits";
import {
  listMarketItemErrorMessage,
  listMarketItemSchema,
} from "./list-market-item";

const itemSerial = 387_997;

describe("listMarketItemSchema", () => {
  test("requires a valid item serial", () => {
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        itemSerial: 0,
        jewelOfBless: 1,
      }).success,
    ).toBe(false);
  });

  test("announces only when the checkbox is ticked", () => {
    const parse = (announce?: string) =>
      listMarketItemSchema.parse({ slotIndex: 0, itemSerial, zen: 1, announce })
        .announce;
    expect(parse("on")).toBe(true);
    expect(parse(undefined)).toBe(false);
    expect(parse("off")).toBe(false);
  });

  test("requires at least one price", () => {
    const result = listMarketItemSchema.safeParse({ slotIndex: 0, itemSerial });
    expect(result.success).toBe(false);
  });

  test("treats blank price fields as zero", () => {
    const result = listMarketItemSchema.safeParse({
      slotIndex: 0,
      itemSerial,
      zen: "",
      jewelOfBless: "1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prices.zen).toBe(0);
      expect(result.data.prices.jewelOfBless).toBe(1);
    }
  });

  test("accepts mixed deposit prices", () => {
    const result = listMarketItemSchema.safeParse({
      slotIndex: 3,
      itemSerial,
      zen: "1000",
      jewelOfBless: "5",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        slotIndex: 3,
        itemSerial,
        announce: false,
        prices: { ...EMPTY_MARKET_PRICES, zen: 1000, jewelOfBless: 5 },
      });
    }
  });

  test("allows zen up to the zen cap and jewels up to the item cap", () => {
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        itemSerial,
        zen: String(MAX_LISTING_ZEN_PRICE),
      }).success,
    ).toBe(true);
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        itemSerial,
        jewelOfBless: String(MAX_LISTING_ITEM_PRICE),
      }).success,
    ).toBe(true);
  });

  test("rejects zen above the zen cap and jewels above the item cap", () => {
    const zen = listMarketItemSchema.safeParse({
      slotIndex: 0,
      itemSerial,
      zen: String(MAX_LISTING_ZEN_PRICE + 1),
    });
    expect(zen.success).toBe(false);
    if (!zen.success) {
      expect(listMarketItemErrorMessage(zen.error)).toBe(
        `Must be at most ${formatNumber(MAX_LISTING_ZEN_PRICE)}.`,
      );
    }

    const jewel = listMarketItemSchema.safeParse({
      slotIndex: 0,
      itemSerial,
      jewelOfBless: String(MAX_LISTING_ITEM_PRICE + 1),
    });
    expect(jewel.success).toBe(false);
    if (!jewel.success) {
      expect(listMarketItemErrorMessage(jewel.error)).toBe(
        `Must be at most ${formatNumber(MAX_LISTING_ITEM_PRICE)}.`,
      );
    }
  });

  test("accepts a price in credits alone, or credits with zen", () => {
    const creditsOnly = listMarketItemSchema.safeParse({
      slotIndex: 0,
      itemSerial,
      credits: "25",
    });
    expect(creditsOnly.success).toBe(true);
    if (creditsOnly.success) {
      expect(creditsOnly.data.prices).toEqual({
        ...EMPTY_MARKET_PRICES,
        credits: 25,
      });
    }

    const mixed = listMarketItemSchema.safeParse({
      slotIndex: 0,
      itemSerial,
      zen: "1000",
      credits: "3",
    });
    expect(mixed.success).toBe(true);
    if (mixed.success) {
      expect(mixed.data.prices).toEqual({
        ...EMPTY_MARKET_PRICES,
        zen: 1000,
        credits: 3,
      });
    }
  });

  test("allows credits up to what an account can hold, above the item cap", () => {
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        itemSerial,
        credits: String(MAX_LISTING_CREDITS_PRICE),
      }).success,
    ).toBe(true);
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        itemSerial,
        credits: String(MAX_LISTING_CREDITS_PRICE + 1),
      }).success,
    ).toBe(false);
  });
});
