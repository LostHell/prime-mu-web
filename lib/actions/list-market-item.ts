"use server";

import { BYTES_PER_SLOT, clearWarehouseSlot } from "@/lib/game/item-decoder";
import { depositColumnsFromAmounts } from "@/lib/utils/deposits";
import { listMarketItemSchema } from "@/lib/validation/list-market-item";
import { UserPanelActionState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

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
    zen: formData.get("zen"),
    rena: formData.get("rena"),
    jewelOfBless: formData.get("jewelOfBless"),
    jewelOfSoul: formData.get("jewelOfSoul"),
    jewelOfLife: formData.get("jewelOfLife"),
    jewelOfCreation: formData.get("jewelOfCreation"),
    jewelOfChaos: formData.get("jewelOfChaos"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: validated.error.flatten().formErrors[0] ?? "Invalid input.",
    };
  }

  const { slotIndex, prices } = validated.data;

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

  try {
    await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.findUnique({
        where: { AccountID: accountId },
        select: { Items: true },
      });

      if (!warehouse?.Items) {
        throw new Error("Warehouse not found.");
      }

      const itemsBuffer = Buffer.from(warehouse.Items);
      const offset = slotIndex * BYTES_PER_SLOT;

      if (offset + BYTES_PER_SLOT > itemsBuffer.length) {
        throw new Error("Invalid slot index.");
      }

      if (itemsBuffer[offset] === 0xff) {
        throw new Error("No item in that slot.");
      }

      const itemHex = itemsBuffer.slice(offset, offset + BYTES_PER_SLOT);
      const updatedBuffer = clearWarehouseSlot(itemsBuffer, slotIndex);

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: warehouse.Items },
        data: { Items: Uint8Array.from(updatedBuffer) },
      });

      if (count === 0) {
        throw new Error(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }

      await tx.marketplaceListing.create({
        data: {
          sellerAccountId: accountId,
          sellerCharacter: firstCharacter.Name,
          itemHex: Uint8Array.from(itemHex),
          ...depositColumnsFromAmounts(prices),
        },
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list item.";
    return { success: false, message };
  }

  revalidatePath("/user-panel/market", "layout");

  return { success: true, message: "Item listed on the marketplace." };
}
