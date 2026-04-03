import { z } from "zod";

export const clearPkSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
});

export type ClearPkInput = z.infer<typeof clearPkSchema>;
