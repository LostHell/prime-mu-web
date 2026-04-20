import { z } from "zod";

export const buyMarketItemSchema = z.object({
  listingId: z.coerce.number().int().min(1),
});

export type BuyMarketItemInput = z.infer<typeof buyMarketItemSchema>;
