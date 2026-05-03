"use server";

import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeItem,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
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

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.status !== "active") {
    return { success: false, message: "Listing not found or already sold." };
  }

  if (listing.sellerAccountId !== accountId) {
    return { success: false, message: "You do not own this listing." };
  }

  const decodedItem = decodeItem(Buffer.from(listing.itemHex));
  if (!decodedItem) {
    return { success: false, message: "Could not decode item data." };
  }
  const itemDef = getItemDefinition(decodedItem.group, decodedItem.index);
  const itemWidth = itemDef?.width ?? 1;
  const itemHeight = itemDef?.height ?? 1;

  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) {
    return { success: false, message: "Warehouse not found." };
  }

  const warehouseBuffer = Buffer.from(warehouse.Items);
  const freeSlot = findFreeArea(warehouseBuffer, itemWidth, itemHeight);

  if (freeSlot === -1) {
    return {
      success: false,
      message: `Not enough space in warehouse for this item (${itemWidth}x${itemHeight}).`,
    };
  }

  const updatedBuffer = writeItemToSlot(
    warehouseBuffer,
    freeSlot,
    listing.itemHex,
  );

  await prisma.$transaction(async (tx) => {
    await tx.warehouse.update({
      where: { AccountID: accountId },
      data: { Items: Uint8Array.from(updatedBuffer) },
    });

    await tx.marketplaceListing.update({
      where: { id: listingId },
      data: { status: "cancelled" },
    });
  });

  revalidatePath("/user-panel/market");
  revalidatePath("/user-panel/market/listed");

  return {
    success: true,
    message: "Listing cancelled. Item returned to warehouse.",
  };
}
