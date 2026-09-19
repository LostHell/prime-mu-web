"use server";

import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  type DepositAmounts,
} from "@/constants/depositable-items";
import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeItem,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import {
  depositAmountsFromColumns,
  depositColumnsFromAmounts,
  hasAnyPositiveDepositAmounts,
} from "@/lib/utils/deposits";
import { buyMarketItemSchema } from "@/lib/validation/buy-market-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const debitDepositAmounts = async (
  tx: Prisma.TransactionClient,
  accountId: string,
  amounts: DepositAmounts,
) => {
  if (!hasAnyPositiveDepositAmounts(amounts)) {
    throw new Error("This listing has no price set.");
  }

  const where: Prisma.AccountDepositWhereInput = { AccountID: accountId };
  const data: Prisma.AccountDepositUpdateManyMutationInput = {};

  if (amounts.zen > 0) {
    where.Zen = { gte: BigInt(amounts.zen) };
    data.Zen = { decrement: BigInt(amounts.zen) };
  }

  for (const type of DEPOSIT_ITEM_TYPES) {
    if (type === "zen") continue;
    const amount = amounts[type];
    const field = DEPOSITABLE_ITEMS[type].dbField;
    if (!field || amount <= 0) continue;
    where[field] = { gte: amount };
    data[field] = { decrement: amount };
  }

  const { count } = await tx.accountDeposit.updateMany({ where, data });
  if (count === 0) {
    throw new Error("Not enough deposited funds to buy this item.");
  }
};

const creditDepositAmounts = async (
  tx: Prisma.TransactionClient,
  accountId: string,
  amounts: DepositAmounts,
) => {
  if (!hasAnyPositiveDepositAmounts(amounts)) {
    throw new Error("This listing has no price set.");
  }

  const fields = depositColumnsFromAmounts(amounts);
  const update: Prisma.AccountDepositUpdateInput = {};

  if (amounts.zen > 0) {
    update.Zen = { increment: BigInt(amounts.zen) };
  }

  for (const type of DEPOSIT_ITEM_TYPES) {
    if (type === "zen") continue;
    const amount = amounts[type];
    const field = DEPOSITABLE_ITEMS[type].dbField;
    if (!field || amount <= 0) continue;
    update[field] = { increment: amount };
  }

  await tx.accountDeposit.upsert({
    where: { AccountID: accountId },
    create: {
      AccountID: accountId,
      ...fields,
      Zen: BigInt(fields.Zen),
    },
    update,
  });
};

export async function buyMarketItemAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = buyMarketItemSchema.safeParse({
    listingId: formData.get("listingId"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { listingId } = validated.data;

  const buyerOffline = await isAccountOffline(accountId);
  if (!buyerOffline) {
    return {
      success: false,
      message: "Disconnect from game before buying marketplace items.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const listing = await tx.marketplaceListing.findUnique({
        where: { id: listingId },
      });

      if (!listing || listing.status !== "active") {
        throw new Error("Listing not found or already sold.");
      }

      if (listing.sellerAccountId === accountId) {
        throw new Error("You cannot buy your own listing.");
      }

      const prices = depositAmountsFromColumns(listing);
      if (!hasAnyPositiveDepositAmounts(prices)) {
        throw new Error("This listing has no price set.");
      }
      const decodedItem = decodeItem(Buffer.from(listing.itemHex));
      if (!decodedItem) {
        throw new Error("Could not decode item data.");
      }

      const itemDef = getItemDefinition({
        group: decodedItem.group,
        index: decodedItem.index,
        level: decodedItem.level,
      });
      const itemWidth = itemDef?.width ?? 1;
      const itemHeight = itemDef?.height ?? 1;

      const buyerWarehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });
      const originalItems = buyerWarehouse?.Items ?? null;
      const buyerBuffer = getWarehouseItemsBuffer(originalItems);
      const freeSlot = findFreeArea(buyerBuffer, itemWidth, itemHeight);

      if (freeSlot === -1) {
        throw new Error(
          `Not enough space in your warehouse for this item (${itemWidth}x${itemHeight}).`,
        );
      }

      const updatedBuyerBuffer = writeItemToSlot(
        buyerBuffer,
        freeSlot,
        listing.itemHex,
      );

      const buyerCharacter = await tx.character.findFirst({
        where: { AccountID: accountId },
        select: { Name: true },
      });

      const { count: claimed } = await tx.marketplaceListing.updateMany({
        where: { id: listingId, status: "active" },
        data: {
          status: "sold",
          buyerAccountId: accountId,
          buyerCharacter: buyerCharacter?.Name ?? null,
          soldAt: new Date(),
        },
      });

      if (claimed === 0) {
        throw new Error("Listing not found or already sold.");
      }

      await debitDepositAmounts(tx, accountId, prices);
      await creditDepositAmounts(tx, listing.sellerAccountId, prices);

      if (!buyerWarehouse) {
        await tx.warehouse.create({
          data: {
            AccountID: accountId,
            Items: Uint8Array.from(updatedBuyerBuffer),
          },
        });
        return;
      }

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: originalItems },
        data: { Items: Uint8Array.from(updatedBuyerBuffer) },
      });

      if (count === 0) {
        throw new Error(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to buy item.";
    return { success: false, message };
  }

  revalidatePath("/user-panel/market", "layout");
  revalidatePath("/user-panel/deposits");

  return {
    success: true,
    message: "Item purchased and added to your warehouse.",
  };
}
