import { getItemDefinition } from "@/lib/game/item-database";
import { decodeItems } from "@/lib/game/item-decoder";
import { BYTES_PER_SLOT } from "@/lib/game/item-decoder/constants";
import { prisma } from "@/prisma/prisma";
import { type WarehouseItem } from "../types/warehouse";

export async function getWarehouseItems(
  accountId: string,
): Promise<WarehouseItem[]> {
  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) return [];

  const decodedItems = decodeItems(Buffer.from(warehouse.Items));

  const warehouseItems = decodedItems.map((item) => {
    const itemDef = getItemDefinition({
      group: item.group,
      index: item.index,
      level: item.level,
    });

    return {
      ...item,
      itemFingerprint: Buffer.from(warehouse.Items!)
        .subarray(item.slot * BYTES_PER_SLOT, (item.slot + 1) * BYTES_PER_SLOT)
        .toString("hex"),
      name: itemDef?.name ?? "Unknown item",
      width: itemDef?.width ?? 1,
      height: itemDef?.height ?? 1,
      defense: itemDef?.defense,
      defRate: itemDef?.defRate,
      dmgMin: itemDef?.dmgMin,
      dmgMax: itemDef?.dmgMax,
      reqStr: itemDef?.reqStr,
      reqAgi: itemDef?.reqAgi,
      classFlags: itemDef?.classFlags,
    };
  });

  return warehouseItems;
}
