import { z } from "zod";

export const addStatsSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
  str: z.number().int().min(0, "Strength cannot be negative"),
  agi: z.number().int().min(0, "Agility cannot be negative"),
  vit: z.number().int().min(0, "Vitality cannot be negative"),
  ene: z.number().int().min(0, "Energy cannot be negative"),
  cmd: z.literal(0, {
    error: "Command allocation is not supported by this server.",
  }),
});

export type AddStatsInput = z.infer<typeof addStatsSchema>;
