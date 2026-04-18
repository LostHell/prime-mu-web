import { z } from "zod";

export const buyMarketplaceItemSchema = z.object({
  listingId: z.coerce.number().int().min(1),
  buyerCharacter: z.string().min(1).max(10),
});

export type BuyMarketplaceItemInput = z.infer<typeof buyMarketplaceItemSchema>;
