"use server";

import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  type AccountDepositItemFields,
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
import { isListingPriceInRange } from "@/lib/validation/listing-price-limits";
import { UserPanelActionState } from "@/lib/validation/types";
import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { ActionError, actionErrorMessage } from "../errors/action-error";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const isUniqueConflict = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

const isOutOfRange = (err: unknown) =>
  err instanceof Error && /out of range/i.test(err.message);

const applyItemAmounts = (
  amounts: DepositAmounts,
  apply: (field: keyof AccountDepositItemFields, amount: number) => void,
) => {
  for (const type of DEPOSIT_ITEM_TYPES) {
    if (type === "zen") continue;
    const amount = amounts[type];
    const field = DEPOSITABLE_ITEMS[type].dbField;
    if (!field || amount <= 0) continue;
    apply(field, amount);
  }
};

const debitDepositAmounts = async (
  tx: Prisma.TransactionClient,
  accountId: string,
  amounts: DepositAmounts,
) => {
  const where: Prisma.AccountDepositWhereInput = { AccountID: accountId };
  const data: Prisma.AccountDepositUpdateManyMutationInput = {};

  if (amounts.zen > 0) {
    where.Zen = { gte: BigInt(amounts.zen) };
    data.Zen = { decrement: BigInt(amounts.zen) };
  }

  applyItemAmounts(amounts, (field, amount) => {
    where[field] = { gte: amount };
    data[field] = { decrement: amount };
  });

  const { count } = await tx.accountDeposit.updateMany({ where, data });
  if (count === 0) {
    throw new ActionError("Not enough deposited funds to buy this item.");
  }
};

const creditDepositAmounts = async (
  tx: Prisma.TransactionClient,
  accountId: string,
  amounts: DepositAmounts,
) => {
  const fields = depositColumnsFromAmounts(amounts);
  const update: Prisma.AccountDepositUpdateInput = {};

  if (amounts.zen > 0) {
    update.Zen = { increment: BigInt(amounts.zen) };
  }

  applyItemAmounts(amounts, (field, amount) => {
    update[field] = { increment: amount };
  });

  try {
    await tx.accountDeposit.upsert({
      where: { AccountID: accountId },
      create: {
        AccountID: accountId,
        ...fields,
        Zen: BigInt(fields.Zen),
      },
      update,
    });
  } catch (err) {
    if (isUniqueConflict(err)) {
      await tx.accountDeposit.update({
        where: { AccountID: accountId },
        data: update,
      });
      return;
    }
    if (isOutOfRange(err)) {
      throw new ActionError("Seller cannot receive this payment.");
    }
    throw err;
  }
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
        throw new ActionError("Listing not found or already sold.");
      }

      if (listing.sellerAccountId === accountId) {
        throw new ActionError("You cannot buy your own listing.");
      }

      const prices = depositAmountsFromColumns(listing);
      if (!hasAnyPositiveDepositAmounts(prices)) {
        throw new ActionError("This listing has no price set.");
      }
      if (!isListingPriceInRange(prices)) {
        throw new ActionError("This listing has an invalid price.");
      }
      const decodedItem = decodeItem(Buffer.from(listing.itemHex));
      if (!decodedItem) {
        throw new ActionError("Could not decode item data.");
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
        throw new ActionError(
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
        throw new ActionError("Listing not found or already sold.");
      }

      await debitDepositAmounts(tx, accountId, prices);
      await creditDepositAmounts(tx, listing.sellerAccountId, prices);

      if (!buyerWarehouse) {
        try {
          await tx.warehouse.create({
            data: {
              AccountID: accountId,
              Items: Uint8Array.from(updatedBuyerBuffer),
            },
          });
          return;
        } catch (err) {
          if (isUniqueConflict(err)) {
            throw new ActionError(
              "Your warehouse changed while processing this request. Please try again.",
            );
          }
          throw err;
        }
      }

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: originalItems },
        data: { Items: Uint8Array.from(updatedBuyerBuffer) },
      });

      if (count === 0) {
        throw new ActionError(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }
    });
  } catch (err) {
    return {
      success: false,
      message: actionErrorMessage(err, "Failed to buy item."),
    };
  }

  revalidatePath("/user-panel/market", "layout");
  revalidatePath("/user-panel/deposits");

  return {
    success: true,
    message: "Item purchased and added to your warehouse.",
  };
}
