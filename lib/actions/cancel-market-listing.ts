"use server";

import { ActionError, actionErrorMessage } from "@/lib/errors/action-error";
import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeItem,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import { buyMarketItemSchema } from "@/lib/validation/buy-market-item";
import { ActionState } from "@/lib/types/action-state";
import { Prisma } from "@/prisma/generated/prisma/client";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const isUniqueConflict = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

export async function cancelMarketplaceListingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = buyMarketItemSchema.safeParse({
    listingId: formData.get("listingId"),
  });

  if (!validated.success) {
    return { success: false, message: "Invalid input." };
  }

  const { listingId } = validated.data;

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Disconnect from game before cancelling listings.",
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

      if (listing.sellerAccountId !== accountId) {
        throw new ActionError("You do not own this listing.");
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

      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });
      const originalItems = warehouse?.Items ?? null;
      const warehouseBuffer = getWarehouseItemsBuffer(originalItems);
      const freeSlot = findFreeArea(warehouseBuffer, itemWidth, itemHeight);

      if (freeSlot === -1) {
        throw new ActionError(
          `Not enough space in your warehouse for this item (${itemWidth}x${itemHeight}).`,
        );
      }

      const updatedBuffer = writeItemToSlot(
        warehouseBuffer,
        freeSlot,
        listing.itemHex,
      );

      const { count: cancelled } = await tx.marketplaceListing.updateMany({
        where: { id: listingId, status: "active", sellerAccountId: accountId },
        data: { status: "cancelled" },
      });

      if (cancelled === 0) {
        throw new ActionError("Listing not found or already sold.");
      }

      if (!warehouse) {
        try {
          await tx.warehouse.create({
            data: {
              AccountID: accountId,
              Items: Uint8Array.from(updatedBuffer),
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
        data: { Items: Uint8Array.from(updatedBuffer) },
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
      message: actionErrorMessage(err, "Failed to cancel listing."),
    };
  }

  revalidatePath("/user-panel/market", "layout");

  return {
    success: true,
    message: "Listing cancelled. Item returned to warehouse.",
  };
}
