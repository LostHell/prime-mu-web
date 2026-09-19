"use server";

import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeItem,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

export async function cancelMarketplaceListingAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const listingId = parseInt(formData.get("listingId") as string);

  if (isNaN(listingId)) {
    return { success: false, message: "Invalid input." };
  }

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
        throw new Error("Listing not found or already sold.");
      }

      if (listing.sellerAccountId !== accountId) {
        throw new Error("You do not own this listing.");
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

      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });
      const originalItems = warehouse?.Items ?? null;
      const warehouseBuffer = getWarehouseItemsBuffer(originalItems);
      const freeSlot = findFreeArea(warehouseBuffer, itemWidth, itemHeight);

      if (freeSlot === -1) {
        throw new Error(
          `Not enough space in warehouse for this item (${itemWidth}x${itemHeight}).`,
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
        throw new Error("Listing not found or already sold.");
      }

      if (!warehouse) {
        await tx.warehouse.create({
          data: {
            AccountID: accountId,
            Items: Uint8Array.from(updatedBuffer),
          },
        });
        return;
      }

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: originalItems },
        data: { Items: Uint8Array.from(updatedBuffer) },
      });

      if (count === 0) {
        throw new Error(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to cancel listing.";
    return { success: false, message };
  }

  revalidatePath("/user-panel/market", "layout");

  return {
    success: true,
    message: "Listing cancelled. Item returned to warehouse.",
  };
}
