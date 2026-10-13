import { ActionError } from "@/lib/errors/action-error";
import { getItemDefinition } from "@/lib/game/item-database";
import {
  decodeItem,
  findFreeArea,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { getWarehouseItemsBuffer } from "@/lib/game/warehouse";
import { Prisma } from "@/prisma/generated/prisma/client";
import { isUniqueConflict } from "./utils";

/** Puts one item into the account warehouse, or throws ActionError. */
export async function placeItemInWarehouse(
  tx: Prisma.TransactionClient,
  accountId: string,
  itemHex: Uint8Array,
) {
  const decodedItem = decodeItem(Buffer.from(itemHex));
  if (!decodedItem) {
    throw new ActionError("Could not decode item data.");
  }

  const itemDef = getItemDefinition({
    group: decodedItem.group,
    index: decodedItem.index,
    level: decodedItem.level,
  });
  if (!itemDef) {
    throw new ActionError(
      "This item is unsupported. Please contact support with the listing number.",
    );
  }

  const warehouse = await tx.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });
  const originalItems = warehouse?.Items ?? null;
  const buffer = getWarehouseItemsBuffer(originalItems);
  const freeSlot = findFreeArea(buffer, itemDef.width, itemDef.height);

  if (freeSlot === -1) {
    throw new ActionError(
      `Not enough space in your warehouse for this item (${itemDef.width}x${itemDef.height}).`,
    );
  }

  const updated = writeItemToSlot(buffer, freeSlot, itemHex);

  if (!warehouse) {
    try {
      await tx.warehouse.create({
        data: {
          AccountID: accountId,
          Items: Uint8Array.from(updated),
        },
      });
      return;
    } catch (err) {
      if (isUniqueConflict(err)) {
        throw new ActionError(
          "Your warehouse changed while processing this request. Please try again.",
        );
      }
      throw err;
    }
  }

  const { count } = await tx.warehouse.updateMany({
    where: { AccountID: accountId, Items: originalItems },
    data: { Items: Uint8Array.from(updated) },
  });

  if (count === 0) {
    throw new ActionError(
      "Your warehouse changed while processing this request. Please try again.",
    );
  }
}
