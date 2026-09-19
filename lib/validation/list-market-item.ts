import {
  EMPTY_DEPOSIT_AMOUNTS,
  type DepositAmounts,
} from "@/constants/depositable-items";
import { hasAnyPositiveDepositAmounts } from "@/lib/utils/deposits";
import { z } from "zod";

export const MAX_LISTING_ZEN_PRICE = 2_000_000_000;
export const MAX_LISTING_ITEM_PRICE = 10_000;

const listingPriceSchema = (max: number) =>
  z.preprocess(
    (value) => (value === "" || value == null ? 0 : value),
    z.coerce.number().int().min(0).max(max),
  );

const zenPriceSchema = listingPriceSchema(MAX_LISTING_ZEN_PRICE);
const itemPriceSchema = listingPriceSchema(MAX_LISTING_ITEM_PRICE);

export const listMarketItemSchema = z
  .object({
    slotIndex: z.coerce.number().int().min(0).max(119),
    zen: zenPriceSchema,
    rena: itemPriceSchema,
    jewelOfBless: itemPriceSchema,
    jewelOfSoul: itemPriceSchema,
    jewelOfLife: itemPriceSchema,
    jewelOfCreation: itemPriceSchema,
    jewelOfChaos: itemPriceSchema,
  })
  .transform((data) => {
    const { slotIndex, ...priceFields } = data;
    const prices: DepositAmounts = { ...EMPTY_DEPOSIT_AMOUNTS, ...priceFields };
    return { slotIndex, prices };
  })
  .refine((data) => hasAnyPositiveDepositAmounts(data.prices), {
    message: "Set at least one price.",
  });

export type ListMarketItemInput = z.infer<typeof listMarketItemSchema>;
