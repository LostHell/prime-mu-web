"use server";

import {
  DEPOSITABLE_ITEMS,
  DEPOSIT_ITEM_TYPES,
  type DepositItemType,
} from "@/constants/depositable-items";
import { countItemType, removeItemsByType } from "@/lib/game/item-decoder";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const depositSchema = z.object({
  type: z.enum(DEPOSIT_ITEM_TYPES as [DepositItemType, ...DepositItemType[]]),
  amount: z.coerce.number().int().positive().optional(),
  depositAll: z.enum(["true", "false"]).optional(),
});

export async function depositAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = depositSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount") || undefined,
    depositAll: formData.get("depositAll") || undefined,
  });

  if (!validated.success) {
    return { success: false, message: "Invalid input." };
  }

  const { type, depositAll } = validated.data;
  const config = DEPOSITABLE_ITEMS[type];

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Your account must be offline to deposit items.",
    };
  }

  if (type === "zen") {
    return depositZen(accountId, validated.data.amount, depositAll === "true");
  }

  if (!config.itemId || !config.dbField) {
    return { success: false, message: "Invalid item type." };
  }

  return depositItem(
    accountId,
    type,
    config.itemId.group,
    config.itemId.index,
    config.dbField,
    config.label,
    validated.data.amount,
    depositAll === "true",
  );
}

async function depositZen(
  accountId: string,
  amount: number | undefined,
  depositAll: boolean,
): Promise<UserPanelActionState> {
  try {
    await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Money: true },
      });

      const available = warehouse?.Money ?? 0;
      const depositAmount = depositAll ? available : (amount ?? 0);

      if (depositAmount <= 0) {
        throw new Error("Amount must be greater than zero.");
      }

      if (available < depositAmount) {
        throw new Error(
          `Not enough Zen in warehouse. Available: ${available.toLocaleString()}.`,
        );
      }

      await tx.warehouse.update({
        where: { AccountID: accountId },
        data: { Money: { decrement: depositAmount } },
      });

      await tx.accountDeposit.upsert({
        where: { AccountID: accountId },
        create: { AccountID: accountId, Zen: depositAmount },
        update: { Zen: { increment: depositAmount } },
      });
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message: "Zen deposited successfully." };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to deposit Zen.";
    return { success: false, message };
  }
}

async function depositItem(
  accountId: string,
  _type: DepositItemType,
  group: number,
  index: number,
  dbField: keyof import("@/constants/depositable-items").AccountDepositItemFields,
  label: string,
  amount: number | undefined,
  depositAll: boolean,
): Promise<UserPanelActionState> {
  try {
    await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });

      if (!warehouse?.Items) {
        throw new Error("Warehouse is empty.");
      }

      const buffer = Buffer.from(warehouse.Items);
      const available = countItemType(buffer, group, index);
      const depositAmount = depositAll ? available : (amount ?? 0);

      if (depositAmount <= 0) {
        throw new Error("Amount must be greater than zero.");
      }

      if (available < depositAmount) {
        throw new Error(
          `Not enough ${label} in warehouse. Available: ${available}.`,
        );
      }

      const newBuffer = removeItemsByType(buffer, group, index, depositAmount);

      await tx.warehouse.update({
        where: { AccountID: accountId },
        data: { Items: Uint8Array.from(newBuffer) },
      });

      await tx.accountDeposit.upsert({
        where: { AccountID: accountId },
        create: { AccountID: accountId, [dbField]: depositAmount },
        update: { [dbField]: { increment: depositAmount } },
      });
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message: `${label} deposited successfully.` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `Failed to deposit ${label}.`;
    return { success: false, message };
  }
}
