"use server";

import { flattenError } from "zod";
import {
  ANNOUNCEMENT_FEE_CREDITS,
  listingFeeCredits,
  listingNotice,
} from "@/constants/market-fees";
import { ActionError, actionErrorMessage } from "@/lib/errors/action-error";
import { NOTICE_BLUE, sendGlobalNotice } from "@/lib/game/data-server";
import { formatItemName } from "@/lib/game/item-database/formatters";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  clearWarehouseSlot,
  decodeItem,
  getItemSerial,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import {
  getItemDefinition,
  searchableItemName,
} from "@/lib/game/item-database";
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
    itemSerial: formData.get("itemSerial"),
    zen: formData.get("zen"),
    credits: formData.get("credits"),
    rena: formData.get("rena"),
    jewelOfBless: formData.get("jewelOfBless"),
    jewelOfSoul: formData.get("jewelOfSoul"),
    jewelOfLife: formData.get("jewelOfLife"),
    jewelOfCreation: formData.get("jewelOfCreation"),
    jewelOfChaos: formData.get("jewelOfChaos"),
    announce: formData.get("announce"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: flattenError(validated.error).fieldErrors,
      message: listMarketItemErrorMessage(validated.error),
    };
  }

  const { slotIndex, prices, itemSerial, announce } = validated.data;
  const fee = listingFeeCredits(announce);

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

  let noticeItem = "";
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
      if (getItemSerial(itemHex) !== itemSerial) {
        throw new ActionError(
          "This item changed since you selected it. Refresh your warehouse and select it again.",
        );
      }
      const decodedItem = decodeItem(itemHex);
      if (!decodedItem) {
        throw new ActionError("Could not decode item data.");
      }
      const itemId = {
        group: decodedItem.group,
        index: decodedItem.index,
        level: decodedItem.level,
      };
      if (!getItemDefinition(itemId)) {
        throw new ActionError(
          "This item is unsupported and cannot be listed. Please contact support.",
        );
      }
      const itemName = searchableItemName(itemId);
      noticeItem = formatItemName({ item: { ...itemId, name: itemName } });

      // The fee, taken only when the account's credits (AFK_CreditReward) cover it.
      const { count: paid } = await tx.aFK_CreditReward.updateMany({
        where: { AccountID: accountId, Credits: { gte: fee } },
        data: { Credits: { decrement: fee } },
      });
      if (paid === 0) {
        throw new ActionError(
          `Listing this item costs ${fee} credits, and you do not have enough.`,
        );
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
          itemName,
          ...depositColumnsFromAmounts(prices),
          Credits: prices.credits,
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

  if (
    announce &&
    !(await sendGlobalNotice(
      listingNotice(firstCharacter.Name, noticeItem),
      NOTICE_BLUE,
    ))
  ) {
    // The listing stands; only the announcement's credits come back.
    try {
      await prisma.aFK_CreditReward.update({
        where: { AccountID: accountId },
        data: { Credits: { increment: ANNOUNCEMENT_FEE_CREDITS } },
      });
    } catch (err) {
      return {
        success: true,
        message: `Item listed on the marketplace, but the game could not be reached for the announcement. ${actionErrorMessage(err, "Its credits could not be given back: please contact support.")}`,
      };
    }
    return {
      success: true,
      message: `Item listed on the marketplace. The game could not be reached for the announcement, so its ${ANNOUNCEMENT_FEE_CREDITS} credits were given back.`,
    };
  }

  return {
    success: true,
    message: announce
      ? "Item listed on the marketplace and announced in the game."
      : "Item listed on the marketplace.",
  };
}
