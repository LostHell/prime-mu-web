"use server";

import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeWarehouseItems,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { buyMarketItemSchema } from "@/lib/validation/buy-market-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

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

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.status !== "active") {
    return { success: false, message: "Listing not found or already sold." };
  }

  if (listing.sellerAccountId === accountId) {
    return { success: false, message: "You cannot buy your own listing." };
  }

  if (listing.zenPrice === null) {
    return { success: false, message: "This listing has no zen price set." };
  }

  const price = listing.zenPrice;

  const itemHexBuf = Buffer.from(listing.itemHex);
  const decodedItems = decodeWarehouseItems(itemHexBuf);
  if (decodedItems.length === 0) {
    return { success: false, message: "Could not decode item data." };
  }
  const decoded = decodedItems[0];
  const itemDef = getItemDefinition(decoded.group, decoded.index);
  const itemWidth = itemDef?.width ?? 1;
  const itemHeight = itemDef?.height ?? 1;

  const buyerWarehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!buyerWarehouse?.Items) {
    return { success: false, message: "Your warehouse was not found." };
  }

  const buyerBuffer = Buffer.from(buyerWarehouse.Items);
  const freeSlot = findFreeArea(buyerBuffer, itemWidth, itemHeight);

  if (freeSlot === -1) {
    return {
      success: false,
      message: `Not enough space in your warehouse for this item (${itemWidth}x${itemHeight}).`,
    };
  }

  const itemBytes = Array.from(listing.itemHex as Buffer);
  const updatedBuyerBuffer = writeItemToSlot(buyerBuffer, freeSlot, itemBytes);

  await prisma.$transaction(async (tx) => {
    // TODO(deposits): Withdraw `price` zen from the buyer's website / deposit balance (account-level),
    // e.g. after adding a model such as `AccountWebsiteZen { accountId, zen }`:
    //   const balance = await tx.accountWebsiteZen.findUnique({ where: { accountId } });
    //   if (!balance || balance.zen < price) throw ...
    //   await tx.accountWebsiteZen.update({ where: { accountId }, data: { zen: { decrement: price } } });
    // Until deposits are implemented, do not deduct character inventory zen for purchases.

    await tx.warehouse.update({
      where: { AccountID: accountId },
      data: { Items: Uint8Array.from(updatedBuyerBuffer) },
    });

    // TODO(deposits): Align seller payout with website balance if you move zen off characters.
    await tx.character.update({
      where: { Name: listing.sellerCharacter },
      data: { Money: { increment: price } },
    });

    await tx.marketplaceListing.update({
      where: { id: listingId },
      data: {
        status: "sold",
        buyerAccountId: accountId,
        buyerCharacter: null,
        soldAt: new Date(),
      },
    });
  });

  revalidatePath("/user-panel/market");

  return {
    success: true,
    message: "Item purchased and added to your warehouse.",
  };
}
