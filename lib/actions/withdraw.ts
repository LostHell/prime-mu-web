"use server";

import {
  DEPOSITABLE_ITEMS,
  DEPOSIT_ITEM_TYPES,
  type AccountDepositItemFields,
  type DepositItemType,
} from "@/constants/depositable-items";
import {
  createFreshItemBytes,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const withdrawSchema = z.object({
  type: z.enum(DEPOSIT_ITEM_TYPES as [DepositItemType, ...DepositItemType[]]),
  amount: z.coerce.number().int().positive(),
});

export async function withdrawAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = withdrawSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
  });

  if (!validated.success) {
    return { success: false, message: "Invalid input." };
  }

  const { type, amount } = validated.data;
  const config = DEPOSITABLE_ITEMS[type];

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Your account must be offline to withdraw items.",
    };
  }

  if (type === "zen") {
    return withdrawZen(accountId, amount);
  }

  if (!config.itemId || !config.dbField) {
    return { success: false, message: "Invalid item type." };
  }

  return withdrawItem(
    accountId,
    config.itemId.group,
    config.itemId.index,
    config.dbField,
    config.label,
    amount,
  );
}

async function withdrawZen(
  accountId: string,
  amount: number,
): Promise<UserPanelActionState> {
  try {
    await prisma.$transaction(async (tx) => {
      const deposit = await tx.accountDeposit.findUnique({
        where: { AccountID: accountId },
        select: { Zen: true },
      });

      const deposited = deposit?.Zen ?? 0;
      if (deposited < amount) {
        throw new Error(
          `Not enough Zen deposited. Available: ${deposited.toLocaleString()}.`,
        );
      }

      await tx.accountDeposit.update({
        where: { AccountID: accountId },
        data: { Zen: { decrement: amount } },
      });

      await tx.warehouse.upsert({
        where: { AccountID: accountId },
        create: { AccountID: accountId, Money: amount },
        update: { Money: { increment: amount } },
      });
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message: "Zen withdrawn successfully." };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to withdraw Zen.";
    return { success: false, message };
  }
}

async function withdrawItem(
  accountId: string,
  group: number,
  index: number,
  dbField: keyof AccountDepositItemFields,
  label: string,
  amount: number,
): Promise<UserPanelActionState> {
  try {
    await prisma.$transaction(async (tx) => {
      const [deposit, warehouse] = await Promise.all([
        tx.accountDeposit.findUnique({
          where: { AccountID: accountId },
        }),
        tx.warehouse.findUnique({
          where: { AccountID: accountId },
          select: { Items: true },
        }),
      ]);

      const deposited = deposit?.[dbField] ?? 0;
      if (deposited < amount) {
        throw new Error(
          `Not enough ${label} deposited. Available: ${deposited}.`,
        );
      }

      const itemBytes = Uint8Array.from(createFreshItemBytes(group, index));
      let buffer: Buffer = warehouse?.Items
        ? Buffer.from(warehouse.Items)
        : Buffer.alloc(1200, 0xff);

      for (let i = 0; i < amount; i++) {
        const slot = findFreeArea(buffer, 1, 1);
        if (slot === -1) {
          throw new Error(
            `Not enough space in warehouse to withdraw ${amount} ${label}. Free up some space and try again.`,
          );
        }
        buffer = writeItemToSlot(buffer, slot, itemBytes);
      }

      await tx.warehouse.upsert({
        where: { AccountID: accountId },
        create: {
          AccountID: accountId,
          Items: Uint8Array.from(buffer),
        },
        update: { Items: Uint8Array.from(buffer) },
      });

      await tx.accountDeposit.update({
        where: { AccountID: accountId },
        data: { [dbField]: { decrement: amount } },
      });
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message: `${label} withdrawn successfully.` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `Failed to withdraw ${label}.`;
    return { success: false, message };
  }
}
