import { z } from "zod";

export const addStatsSchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
  str: z.number().int().min(0, "Strength cannot be negative"),
  agi: z.number().int().min(0, "Agility cannot be negative"),
  vit: z.number().int().min(0, "Vitality cannot be negative"),
  ene: z.number().int().min(0, "Energy cannot be negative"),
  cmd: z.number().int().min(0, "Command cannot be negative"),
});

export type AddStatsInput = z.infer<typeof addStatsSchema>;
