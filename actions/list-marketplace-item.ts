"use server";

import { BYTES_PER_SLOT, clearWarehouseSlot, decodeWarehouseItems } from "@/lib/item-decoder";
import { listMarketplaceItemSchema } from "@/lib/validation/list-marketplace-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline, verifyCharacterOwnership } from "./utils";

export async function listMarketplaceItemAction(
  _state: UserPanelActionState,
  formData: FormData,
): Promise<UserPanelActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = listMarketplaceItemSchema.safeParse({
    characterName: formData.get("characterName"),
    slotIndex: formData.get("slotIndex"),
    currencyType: formData.get("currencyType"),
    price: formData.get("price"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input.",
    };
  }

  const { characterName, slotIndex, currencyType, price } = validated.data;

  const character = await verifyCharacterOwnership(characterName);
  if (!character) {
    return { success: false, message: "Character not found." };
  }

  const offline = await isAccountOffline(accountId);
  if (!offline) {
    return {
      success: false,
      message: "Disconnect from game before listing warehouse items.",
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

  const items = decodeWarehouseItems(itemsBuffer);
  const item = items.find((i) => i.slot === slotIndex);
  if (!item) {
    return { success: false, message: "Could not decode item." };
  }

  const activeListings = await prisma.marketplaceListing.count({
    where: { sellerAccountId: accountId, status: "active" },
  });

  if (activeListings >= 10) {
    return {
      success: false,
      message: "You can have at most 10 active listings.",
    };
  }

  const updatedBuffer = clearWarehouseSlot(itemsBuffer, slotIndex);

  await prisma.warehouse.update({
    where: { AccountID: accountId },
    data: { Items: Uint8Array.from(updatedBuffer) },
  });

  await prisma.marketplaceListing.create({
    data: {
      sellerAccountId: accountId,
      sellerCharacter: characterName,
      itemGroup: item.group,
      itemIndex: item.index,
      itemLevel: item.level,
      itemData: Buffer.from(item.rawBytes),
      warehouseSlot: slotIndex,
      currencyType,
      price,
    },
  });

  revalidatePath(`/user-panel/${encodeURIComponent(characterName)}/warehouse`);
  revalidatePath("/marketplace");

  return { success: true, message: "Item listed on the marketplace." };
}
