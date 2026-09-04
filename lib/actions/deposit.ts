"use server";

import {
  DEPOSITABLE_ITEMS,
  type AccountDepositItemFields,
} from "@/constants/depositable-items";
import { type ItemId } from "@/lib/game/item-database/types";
import { countItemsByType, removeItemsByType } from "@/lib/game/warehouse";
import { depositSchema } from "@/lib/validation/deposit";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

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
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { type, amount, depositAll } = validated.data;
  const config = DEPOSITABLE_ITEMS[type];

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Your account must be offline to deposit.",
    };
  }

  return type === "zen"
    ? depositZen(accountId, amount, depositAll === "true")
    : depositItem(accountId, config, amount, depositAll === "true");
}

async function depositZen(
  accountId: string,
  amount: number | undefined,
  depositAll: boolean,
): Promise<UserPanelActionState> {
  try {
    const message = await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Money: true },
      });

      const available = warehouse?.Money ?? 0;
      const depositAmount = depositAll ? available : (amount ?? 0);

      if (depositAmount <= 0) {
        throw new Error("Amount must be greater than zero.");
      }

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Money: { gte: depositAmount } },
        data: { Money: { decrement: depositAmount } },
      });

      if (count === 0) {
        throw new Error(
          `Not enough Zen in warehouse. Available: ${available.toLocaleString()}.`,
        );
      }

      await tx.accountDeposit.upsert({
        where: { AccountID: accountId },
        create: { AccountID: accountId, Zen: depositAmount },
        update: { Zen: { increment: depositAmount } },
      });

      return "Zen deposited successfully.";
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to deposit Zen.";
    return { success: false, message };
  }
}

async function depositItem(
  accountId: string,
  config: {
    itemId?: ItemId;
    dbField?: keyof AccountDepositItemFields;
    label: string;
  },
  amount: number | undefined,
  depositAll: boolean,
): Promise<UserPanelActionState> {
  const { itemId, dbField, label } = config;

  if (!itemId || !dbField) {
    return { success: false, message: "Invalid item type." };
  }

  try {
    const message = await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });

      if (!warehouse?.Items) {
        throw new Error("Warehouse is empty.");
      }

      const buffer = Buffer.from(warehouse.Items);
      const available = countItemsByType(buffer, itemId);
      const depositAmount = depositAll ? available : (amount ?? 0);

      if (depositAmount <= 0) {
        throw new Error("Amount must be greater than zero.");
      }

      if (available < depositAmount) {
        throw new Error(
          `Not enough ${label} in warehouse. Available: ${available}.`,
        );
      }

      const newBuffer = removeItemsByType(buffer, itemId, depositAmount);

      // Optimistic lock on the raw buffer: only write if nothing else changed
      // the warehouse contents since we read it.
      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: warehouse.Items },
        data: { Items: Uint8Array.from(newBuffer) },
      });

      if (count === 0) {
        throw new Error(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }

      await tx.accountDeposit.upsert({
        where: { AccountID: accountId },
        create: { AccountID: accountId, [dbField]: depositAmount },
        update: { [dbField]: { increment: depositAmount } },
      });

      return `${label} deposited successfully.`;
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `Failed to deposit ${label}.`;
    return { success: false, message };
  }
}
