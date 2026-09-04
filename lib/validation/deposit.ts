import {
  DEPOSIT_ITEM_TYPES,
  type DepositItemType,
} from "@/constants/depositable-items";
import { z } from "zod";

export const depositSchema = z.object({
  type: z.enum(DEPOSIT_ITEM_TYPES as [DepositItemType, ...DepositItemType[]]),
  amount: z.coerce.number().int().positive().optional(),
  depositAll: z.enum(["true", "false"]).optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;
