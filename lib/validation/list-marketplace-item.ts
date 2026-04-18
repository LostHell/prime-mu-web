import { z } from "zod";

export const listMarketplaceItemSchema = z.object({
  characterName: z.string().min(1).max(10),
  slotIndex: z.coerce.number().int().min(0).max(119),
  currencyType: z.enum(["zen", "credits"]),
  price: z.coerce.number().int().min(1).max(2000000000),
});

export type ListMarketplaceItemInput = z.infer<typeof listMarketplaceItemSchema>;
