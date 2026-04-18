"use server";

import { findFreeSlot, writeItemToSlot } from "@/lib/item-decoder";
import { buyMarketplaceItemSchema } from "@/lib/validation/buy-marketplace-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline, verifyCharacterOwnership } from "./utils";

export async function buyMarketplaceItemAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = buyMarketplaceItemSchema.safeParse({
    listingId: formData.get("listingId"),
    buyerCharacter: formData.get("buyerCharacter"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { listingId, buyerCharacter } = validated.data;

  const character = await verifyCharacterOwnership(buyerCharacter);
  if (!character) {
    return { success: false, message: "Character not found." };
  }

  const buyerOffline = await isAccountOffline(accountId);
  if (!buyerOffline) {
    return {
      success: false,
      message: "Disconnect from game before buying marketplace items.",
    };
  }

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.status !== "active") {
    return { success: false, message: "Listing not found or already sold." };
  }

  if (listing.sellerAccountId === accountId) {
    return { success: false, message: "You cannot buy your own listing." };
  }

  if (listing.currencyType === "zen") {
    if ((character.Money ?? 0) < listing.price) {
      return { success: false, message: "Not enough zen." };
    }
  } else {
    const credits = await prisma.accountCredits.findUnique({
      where: { accountId },
    });
    if (!credits || credits.credits < listing.price) {
      return { success: false, message: "Not enough credits." };
    }
  }

  const buyerWarehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!buyerWarehouse?.Items) {
    return { success: false, message: "Your warehouse was not found." };
  }

  const buyerBuffer = Buffer.from(buyerWarehouse.Items);
  const freeSlot = findFreeSlot(buyerBuffer);

  if (freeSlot === -1) {
    return { success: false, message: "Your warehouse is full." };
  }

  const itemBytes = Array.from(listing.itemData as Buffer);
  const updatedBuyerBuffer = writeItemToSlot(buyerBuffer, freeSlot, itemBytes);

  await prisma.$transaction(async (tx) => {
    await tx.warehouse.update({
      where: { AccountID: accountId },
      data: { Items: Uint8Array.from(updatedBuyerBuffer) },
    });

    if (listing.currencyType === "zen") {
      await tx.character.update({
        where: { Name: buyerCharacter },
        data: { Money: { decrement: listing.price } },
      });

      await tx.character.update({
        where: { Name: listing.sellerCharacter },
        data: { Money: { increment: listing.price } },
      });
    } else {
      await tx.accountCredits.update({
        where: { accountId },
        data: { credits: { decrement: listing.price } },
      });

      await tx.accountCredits.upsert({
        where: { accountId: listing.sellerAccountId },
        create: { accountId: listing.sellerAccountId, credits: listing.price },
        update: { credits: { increment: listing.price } },
      });
    }

    await tx.marketplaceListing.update({
      where: { id: listingId },
      data: {
        status: "sold",
        buyerAccountId: accountId,
        buyerCharacter,
        soldAt: new Date(),
      },
    });
  });

  revalidatePath("/marketplace");
  revalidatePath(`/user-panel/${encodeURIComponent(buyerCharacter)}/warehouse`);

  return { success: true, message: "Item purchased and added to your warehouse." };
}
