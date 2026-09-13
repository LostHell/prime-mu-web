import { getItemDefinition } from "@/lib/game/item-database";
import { decodeItems } from "@/lib/game/item-decoder";
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
