"use server";

import {
  DEPOSITABLE_ITEMS,
  type AccountDepositItemFields,
} from "@/constants/depositable-items";
import {
  MAX_WAREHOUSE_MONEY,
  WAREHOUSE_SLOTS,
} from "@/lib/game/constants/warehouse";
import { getItemDefinition } from "@/lib/game/item-database";
import { type ItemId } from "@/lib/game/item-database/types";
import {
  BYTES_PER_SLOT,
  createItemBytes,
  EMPTY_SLOT_BYTE,
  findFreeAreas,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { UserPanelActionState } from "@/lib/validation/types";
import { withdrawSchema } from "@/lib/validation/withdraw";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

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
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { type, amount } = validated.data;
  const config = DEPOSITABLE_ITEMS[type];

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Your account must be offline to withdraw.",
    };
  }

  return type === "zen"
    ? withdrawZen(accountId, amount)
    : withdrawItem(accountId, config, amount);
}

async function withdrawZen(
  accountId: string,
  amount: number,
): Promise<UserPanelActionState> {
  try {
    const message = await prisma.$transaction(async (tx) => {
      const [deposit, warehouse] = await Promise.all([
        tx.accountDeposit.findUnique({
          where: { AccountID: accountId },
          select: { Zen: true },
        }),
        tx.warehouse.findUnique({
          where: { AccountID: accountId },
          select: { Money: true },
        }),
      ]);

      const deposited = deposit?.Zen ?? 0n;
      if (deposited < amount) {
        throw new Error(
          `Not enough Zen deposited. Available: ${deposited.toLocaleString()}.`,
        );
      }

      // Guard the decrement with `gte` so a concurrent withdrawal can't push the
      // balance negative between this read and the write (lost-update race).
      const { count: withdrawCount } = await tx.accountDeposit.updateMany({
        where: { AccountID: accountId, Zen: { gte: amount } },
        data: { Zen: { decrement: amount } },
      });

      if (withdrawCount === 0) {
        throw new Error(
          `Not enough Zen deposited. Available: ${deposited.toLocaleString()}.`,
        );
      }

      if (!warehouse) {
        await tx.warehouse.create({
          data: { AccountID: accountId, Money: amount },
        });
        return "Zen withdrawn successfully.";
      }

      // Guard the increment so the total can never exceed warehouse.Money's
      // UnsignedInt capacity, atomically at the DB level.
      const { count: creditCount } = await tx.warehouse.updateMany({
        where: {
          AccountID: accountId,
          Money: { lte: MAX_WAREHOUSE_MONEY - amount },
        },
        data: { Money: { increment: amount } },
      });

      if (creditCount === 0) {
        throw new Error(
          "Withdrawing this amount would exceed your warehouse's Zen capacity. Try a smaller amount.",
        );
      }

      return "Zen withdrawn successfully.";
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to withdraw Zen.";
    return { success: false, message };
  }
}

async function withdrawItem(
  accountId: string,
  config: {
    itemId?: ItemId;
    dbField?: keyof AccountDepositItemFields;
    label: string;
  },
  amount: number,
): Promise<UserPanelActionState> {
  const { itemId, dbField, label } = config;
  if (!itemId || !dbField) {
    return { success: false, message: "Invalid item type." };
  }

  try {
    const message = await prisma.$transaction(async (tx) => {
      const [deposit, warehouse] = await Promise.all([
        tx.accountDeposit.findUnique({
          where: { AccountID: accountId },
          select: { [dbField]: true },
        }),
        tx.warehouse.findUnique({
          where: { AccountID: accountId },
          select: { Items: true },
        }),
      ]);

      const deposited = (deposit?.[dbField] as number | undefined) ?? 0;
      if (deposited < amount) {
        throw new Error(
          `Not enough ${label} deposited. Available: ${deposited}.`,
        );
      }

      const originalItems = warehouse?.Items ?? null;
      const buffer = originalItems
        ? Buffer.from(originalItems)
        : Buffer.alloc(WAREHOUSE_SLOTS * BYTES_PER_SLOT, EMPTY_SLOT_BYTE);

      const itemDef = getItemDefinition(itemId);
      const itemWidth = itemDef?.width ?? 1;
      const itemHeight = itemDef?.height ?? 1;

      const freeSlots = findFreeAreas(buffer, itemWidth, itemHeight, amount);
      if (freeSlots.length < amount) {
        throw new Error(
          `Not enough space in warehouse to withdraw ${amount} ${label} (${itemWidth}x${itemHeight} each). Free up some space and try again.`,
        );
      }

      const itemBytes = Uint8Array.from(
        createItemBytes(itemId.group, itemId.index, itemId.level),
      );
      const newBuffer = freeSlots.reduce<Buffer>(
        (buf, slot) => writeItemToSlot(buf, slot, itemBytes),
        buffer,
      );

      if (!warehouse) {
        await tx.warehouse.create({
          data: { AccountID: accountId, Items: Uint8Array.from(newBuffer) },
        });
      } else {
        // Optimistic lock: only write if nothing else changed the warehouse
        // contents since we read it.
        const { count } = await tx.warehouse.updateMany({
          where: { AccountID: accountId, Items: originalItems },
          data: { Items: Uint8Array.from(newBuffer) },
        });

        if (count === 0) {
          throw new Error(
            "Your warehouse changed while processing this request. Please try again.",
          );
        }
      }

      // Guard the decrement with `gte` so a concurrent withdrawal can't push
      // the deposited balance negative (lost-update race).
      const { count: depositCount } = await tx.accountDeposit.updateMany({
        where: { AccountID: accountId, [dbField]: { gte: amount } },
        data: { [dbField]: { decrement: amount } },
      });

      if (depositCount === 0) {
        throw new Error(
          `Not enough ${label} deposited. Available: ${deposited}.`,
        );
      }

      return `${label} withdrawn successfully.`;
    });

    revalidatePath("/user-panel/deposits");
    return { success: true, message };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : `Failed to withdraw ${label}.`;
    return { success: false, message };
  }
}
