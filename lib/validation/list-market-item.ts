import {
  EMPTY_MARKET_PRICES,
  type MarketPrices,
} from "@/constants/market-prices";
import { hasAnyPositiveMarketPrice } from "@/lib/utils/market-prices";
import { formatNumber } from "@/lib/utils/numbers";
import { listingPriceLimit } from "@/lib/validation/listing-price-limits";
import { flattenError, z } from "zod";
import { MAX_ITEM_SERIAL } from "@/lib/game/item-decoder/constants";
import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";

const listingPriceSchema = (max: number) =>
  z.preprocess(
    (value) => (value === "" || value == null ? 0 : value),
    z.coerce
      .number()
      .int()
      .min(0)
      .max(max, `Must be at most ${formatNumber(max)}.`),
  );

export const listMarketItemSchema = z
  .object({
    slotIndex: z.coerce
      .number()
      .int()
      .min(0)
      .max(WAREHOUSE_SLOTS - 1),
    itemSerial: z.coerce.number().int().min(1).max(MAX_ITEM_SERIAL),
    zen: listingPriceSchema(listingPriceLimit("zen")),
    credits: listingPriceSchema(listingPriceLimit("credits")),
    rena: listingPriceSchema(listingPriceLimit("rena")),
    jewelOfBless: listingPriceSchema(listingPriceLimit("jewelOfBless")),
    jewelOfSoul: listingPriceSchema(listingPriceLimit("jewelOfSoul")),
    jewelOfLife: listingPriceSchema(listingPriceLimit("jewelOfLife")),
    jewelOfCreation: listingPriceSchema(listingPriceLimit("jewelOfCreation")),
    jewelOfChaos: listingPriceSchema(listingPriceLimit("jewelOfChaos")),
    // The "announce in game" checkbox: "on" when ticked, missing otherwise.
    announce: z.preprocess((value) => value === "on", z.boolean()),
  })
  .transform((data) => {
    const { slotIndex, itemSerial, announce, ...priceFields } = data;
    const prices: MarketPrices = { ...EMPTY_MARKET_PRICES, ...priceFields };
    return { slotIndex, itemSerial, announce, prices };
  })
  .refine((data) => hasAnyPositiveMarketPrice(data.prices), {
    message: "Set at least one price.",
  });

export type ListMarketItemInput = z.infer<typeof listMarketItemSchema>;

export const listMarketItemErrorMessage = (error: z.ZodError): string => {
  const { formErrors, fieldErrors } = flattenError(error);
  return (
    formErrors[0] ??
    Object.values(fieldErrors)
      .flat()
      .find((message) => Boolean(message)) ??
    "Invalid input."
  );
};
