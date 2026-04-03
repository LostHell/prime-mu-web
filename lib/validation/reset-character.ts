import { z } from "zod";

export const resetCharacterSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
});

export type ResetCharacterInput = z.infer<typeof resetCharacterSchema>;
