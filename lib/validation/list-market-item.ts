import { z } from "zod";

export const listMarketItemSchema = z.object({
  slotIndex: z.coerce.number().int().min(0).max(119),
  zenPrice: z.coerce.number().int().min(1).max(2000000000),
});

export type ListMarketItemInput = z.infer<typeof listMarketItemSchema>;
