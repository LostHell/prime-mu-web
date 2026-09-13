import {
  DEPOSIT_ITEM_TYPES,
  type DepositItemType,
} from "@/constants/depositable-items";
import { z } from "zod";

export const withdrawSchema = z.object({
  type: z.enum(DEPOSIT_ITEM_TYPES as [DepositItemType, ...DepositItemType[]]),
  amount: z.coerce.number().int().positive(),
});

export type WithdrawInput = z.infer<typeof withdrawSchema>;
