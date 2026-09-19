import {
  EMPTY_DEPOSIT_AMOUNTS,
  type DepositAmounts,
} from "@/constants/depositable-items";
import { hasAnyPositiveDepositAmounts } from "@/lib/utils/deposits";
import { formatNumber } from "@/lib/utils/numbers";
import { listingPriceLimit } from "@/lib/validation/listing-price-limits";
import { z } from "zod";

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
    slotIndex: z.coerce.number().int().min(0).max(119),
    zen: listingPriceSchema(listingPriceLimit("zen")),
    rena: listingPriceSchema(listingPriceLimit("rena")),
    jewelOfBless: listingPriceSchema(listingPriceLimit("jewelOfBless")),
    jewelOfSoul: listingPriceSchema(listingPriceLimit("jewelOfSoul")),
    jewelOfLife: listingPriceSchema(listingPriceLimit("jewelOfLife")),
    jewelOfCreation: listingPriceSchema(listingPriceLimit("jewelOfCreation")),
    jewelOfChaos: listingPriceSchema(listingPriceLimit("jewelOfChaos")),
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

export const listMarketItemErrorMessage = (error: z.ZodError): string => {
  const { formErrors, fieldErrors } = error.flatten();
  return (
    formErrors[0] ??
    Object.values(fieldErrors)
      .flat()
      .find((message) => Boolean(message)) ??
    "Invalid input."
  );
};
