"use server";

import { ActionError, actionErrorMessage } from "@/lib/errors/action-error";
import { listingIdSchema } from "@/lib/validation/listing-id";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { placeItemInWarehouse } from "./place-warehouse-item";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

export async function cancelMarketplaceListingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = listingIdSchema.safeParse({
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

      const { count: cancelled } = await tx.marketplaceListing.updateMany({
        where: { id: listingId, status: "active", sellerAccountId: accountId },
        data: { status: "cancelled" },
      });

      if (cancelled === 0) {
        throw new ActionError("Listing not found or already sold.");
      }

      await placeItemInWarehouse(tx, accountId, listing.itemHex);
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
