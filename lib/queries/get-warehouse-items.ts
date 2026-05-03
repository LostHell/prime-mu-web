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

  if (!warehouse?.Items)
    return [];

  const decodedItems = decodeItems(Buffer.from(warehouse.Items));

  const warehouseItems = decodedItems.map((item) => {
    const def = getItemDefinition(item.group, item.index);
    return {
      ...item,
      name: def?.name ?? "Unknown item",
      width: def?.width ?? 1,
      height: def?.height ?? 1,
      defense: def?.defense,
      defRate: def?.defRate,
      dmgMin: def?.dmgMin,
      dmgMax: def?.dmgMax,
      reqStr: def?.reqStr,
      reqAgi: def?.reqAgi,
      classFlags: def?.classFlags,
    };
  });

  return warehouseItems;
}
