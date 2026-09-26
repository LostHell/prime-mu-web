"use server";

import { ActionError, actionErrorMessage } from "@/lib/errors/action-error";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  clearWarehouseSlot,
  decodeItem,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import { depositColumnsFromAmounts } from "@/lib/utils/deposits";
import {
  listMarketItemErrorMessage,
  listMarketItemSchema,
} from "@/lib/validation/list-market-item";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, isAccountOffline } from "./utils";

export async function listMarketItemAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = listMarketItemSchema.safeParse({
    slotIndex: formData.get("slotIndex"),
    itemFingerprint: formData.get("itemFingerprint"),
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
      message: listMarketItemErrorMessage(validated.error),
    };
  }

  const { slotIndex, prices, itemFingerprint } = validated.data;

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

      if (!warehouse) {
        throw new ActionError("Warehouse not found.");
      }

      const itemsBuffer = getWarehouseItemsBuffer(warehouse.Items);
      const offset = slotIndex * BYTES_PER_SLOT;

      if (offset + BYTES_PER_SLOT > itemsBuffer.length) {
        throw new ActionError("Invalid slot index.");
      }

      if (itemsBuffer[offset] === EMPTY_SLOT_BYTE) {
        throw new ActionError("No item in that slot.");
      }

      const itemHex = itemsBuffer.slice(offset, offset + BYTES_PER_SLOT);
      if (itemHex.toString("hex") !== itemFingerprint) {
        throw new ActionError(
          "This item changed since you selected it. Refresh your warehouse and select it again.",
        );
      }
      if (!decodeItem(itemHex)) {
        throw new ActionError("Could not decode item data.");
      }

      const updatedBuffer = clearWarehouseSlot(itemsBuffer, slotIndex);

      const { count } = await tx.warehouse.updateMany({
        where: { AccountID: accountId, Items: warehouse.Items },
        data: { Items: Uint8Array.from(updatedBuffer) },
      });

      if (count === 0) {
        throw new ActionError(
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
    return {
      success: false,
      message: actionErrorMessage(err, "Failed to list item."),
    };
  }

  revalidatePath("/user-panel/market", "layout");

  return { success: true, message: "Item listed on the marketplace." };
}
