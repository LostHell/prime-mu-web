"use server";

import { BYTES_PER_SLOT, clearWarehouseSlot } from "@/lib/item-decoder";
import { listMarketItemSchema } from "@/lib/validation/list-market-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

const MAX_ACTIVE_LISTINGS = 10;

export async function listMarketItemAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = listMarketItemSchema.safeParse({
    slotIndex: formData.get("slotIndex"),
    zenPrice: formData.get("zenPrice"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { slotIndex, zenPrice } = validated.data;

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Disconnect from game before listing warehouse items.",
    };
  }

  const firstCharacter = await prisma.character.findFirst({
    where: { AccountID: accountId },
    select: { Name: true },
  });

  if (!firstCharacter) {
    return {
      success: false,
      message: "You need at least one character to list items.",
    };
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) {
    return { success: false, message: "Warehouse not found." };
  }

  const itemsBuffer = Buffer.from(warehouse.Items);
  const offset = slotIndex * BYTES_PER_SLOT;

  if (offset + BYTES_PER_SLOT > itemsBuffer.length) {
    return { success: false, message: "Invalid slot index." };
  }

  if (itemsBuffer[offset] === 0xff) {
    return { success: false, message: "No item in that slot." };
  }

  const itemHex = itemsBuffer.slice(offset, offset + BYTES_PER_SLOT);

  const activeListings = await prisma.marketplaceListing.count({
    where: { sellerAccountId: accountId, status: "active" },
  });

  if (activeListings >= MAX_ACTIVE_LISTINGS) {
    return {
      success: false,
      message: `You can have at most ${MAX_ACTIVE_LISTINGS} active listings.`,
    };
  }

  const updatedBuffer = clearWarehouseSlot(itemsBuffer, slotIndex);

  await prisma.$transaction(async (tx) => {
    await tx.warehouse.update({
      where: { AccountID: accountId },
      data: { Items: Uint8Array.from(updatedBuffer) },
    });

    await tx.marketplaceListing.create({
      data: {
        sellerAccountId: accountId,
        sellerCharacter: firstCharacter.Name,
        itemHex: Uint8Array.from(itemHex),
        zenPrice,
      },
    });
  });

  revalidatePath("/user-panel/market");

  return { success: true, message: "Item listed on the marketplace." };
}
