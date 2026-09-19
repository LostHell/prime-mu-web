import { EMPTY_DEPOSIT_AMOUNTS } from "@/constants/depositable-items";
import {
  listMarketItemSchema,
  MAX_LISTING_ITEM_PRICE,
  MAX_LISTING_ZEN_PRICE,
} from "./list-market-item";

describe("listMarketItemSchema", () => {
  test("requires at least one price", () => {
    const result = listMarketItemSchema.safeParse({
      slotIndex: 0,
    });
    expect(result.success).toBe(false);
  });

  test("treats blank price fields as zero", () => {
    const result = listMarketItemSchema.safeParse({
      slotIndex: 0,
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
      zen: "1000",
      jewelOfBless: "5",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        slotIndex: 3,
        prices: { ...EMPTY_DEPOSIT_AMOUNTS, zen: 1000, jewelOfBless: 5 },
      });
    }
  });

  test("allows zen up to the zen cap and jewels up to the item cap", () => {
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        zen: String(MAX_LISTING_ZEN_PRICE),
      }).success,
    ).toBe(true);
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        jewelOfBless: String(MAX_LISTING_ITEM_PRICE),
      }).success,
    ).toBe(true);
  });

  test("rejects zen above the zen cap and jewels above the item cap", () => {
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        zen: String(MAX_LISTING_ZEN_PRICE + 1),
      }).success,
    ).toBe(false);
    expect(
      listMarketItemSchema.safeParse({
        slotIndex: 0,
        jewelOfBless: String(MAX_LISTING_ITEM_PRICE + 1),
      }).success,
    ).toBe(false);
  });
});
