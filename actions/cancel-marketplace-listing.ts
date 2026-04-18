"use server";

import { findFreeSlot, writeItemToSlot } from "@/lib/item-decoder";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline, verifyCharacterOwnership } from "./utils";

export async function cancelMarketplaceListingAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const listingId = parseInt(formData.get("listingId") as string);
  const characterName = formData.get("characterName") as string;

  if (isNaN(listingId) || !characterName) {
    return { success: false, message: "Invalid input." };
  }

  const character = await verifyCharacterOwnership(characterName);
  if (!character) {
    return { success: false, message: "Character not found." };
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

  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) {
    return { success: false, message: "Warehouse not found." };
  }

  const warehouseBuffer = Buffer.from(warehouse.Items);
  const freeSlot = findFreeSlot(warehouseBuffer);

  if (freeSlot === -1) {
    return {
      success: false,
      message: "Your warehouse is full, cannot return item.",
    };
  }

  const itemBytes = Array.from(listing.itemData as Buffer);
  const updatedBuffer = writeItemToSlot(warehouseBuffer, freeSlot, itemBytes);

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

  revalidatePath(`/user-panel/${encodeURIComponent(characterName)}/warehouse`);
  revalidatePath(`/user-panel/${encodeURIComponent(characterName)}/my-listings`);
  revalidatePath("/marketplace");

  return { success: true, message: "Listing cancelled. Item returned to warehouse." };
}
