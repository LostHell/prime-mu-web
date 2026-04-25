import { getItemDefinition, getItemName } from "@/lib/item-database";
import { decodeWarehouseItems } from "@/lib/item-decoder";
import { prisma } from "@/prisma/prisma";
import { DecodedItem, ItemDefinition } from "@/types/item";

export type WarehouseItem = DecodedItem &
  Pick<
    ItemDefinition,
    | "defense"
    | "defRate"
    | "dmgMin"
    | "dmgMax"
    | "reqStr"
    | "reqAgi"
    | "classFlags"
  > & {
    name: string;
    width: number;
    height: number;
  };

export async function getWarehouseItems(
  accountId: string,
): Promise<WarehouseItem[]> {
  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) return [];

  const decoded = decodeWarehouseItems(Buffer.from(warehouse.Items));

  return decoded.map((item) => {
    const def = getItemDefinition(item.group, item.index);
    return {
      ...item,
      name: def?.name ?? getItemName(item.group, item.index),
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
}
