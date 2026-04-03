import { z } from "zod";

export const unstuckSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
});

export type UnstuckInput = z.infer<typeof unstuckSchema>;
