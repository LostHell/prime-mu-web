import { getItemName } from "@/lib/item-database";
import { decodeWarehouseItems } from "@/lib/item-decoder";
import { prisma } from "@/prisma/prisma";
import { DecodedItem } from "@/types/item";

export type WarehouseItem = DecodedItem & { name: string };

export async function getWarehouseItems(accountId: string): Promise<WarehouseItem[]> {
  const warehouse = await prisma.warehouse.findUnique({
    where: { AccountID: accountId },
    select: { Items: true },
  });

  if (!warehouse?.Items) return [];

  const decoded = decodeWarehouseItems(Buffer.from(warehouse.Items));

  return decoded.map((item) => ({
    ...item,
    name: getItemName(item.group, item.index),
  }));
}
