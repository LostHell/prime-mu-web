import { z } from "zod";

export const listingIdSchema = z.object({
  listingId: z.coerce.number().int().min(1),
});

export type ListingIdInput = z.infer<typeof listingIdSchema>;
