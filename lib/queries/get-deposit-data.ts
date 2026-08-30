import {
  DEPOSITABLE_ITEMS,
  type AccountDepositItemFields,
  type DepositItemType,
} from "@/constants/depositable-items";
import { countItemType } from "@/lib/game/item-decoder";
import { prisma } from "@/prisma/prisma";

export type DepositData = {
  warehouseZen: number;
  warehouseCounts: Record<DepositItemType, number>;
  balance: { Zen: number } & AccountDepositItemFields;
};

const ZERO_BALANCE: DepositData["balance"] = {
  Zen: 0,
  Rena: 0,
  JewelOfBless: 0,
  JewelOfSoul: 0,
  JewelOfLife: 0,
  JewelOfCreation: 0,
  JewelOfChaos: 0,
};

export async function getDepositData(accountId: string): Promise<DepositData> {
  const [warehouse, depositRow] = await Promise.all([
    prisma.warehouse.findUnique({
      where: { AccountID: accountId },
      select: { Items: true, Money: true },
    }),
    prisma.accountDeposit.findUnique({
      where: { AccountID: accountId },
    }),
  ]);

  const warehouseZen = warehouse?.Money ?? 0;

  const warehouseCounts = {} as Record<DepositItemType, number>;
  const itemBuffer = warehouse?.Items ? Buffer.from(warehouse.Items) : null;

  for (const [type, config] of Object.entries(DEPOSITABLE_ITEMS) as [
    DepositItemType,
    (typeof DEPOSITABLE_ITEMS)[DepositItemType],
  ][]) {
    if (type === "zen" || !config.itemId) {
      warehouseCounts[type] = 0;
      continue;
    }
    warehouseCounts[type] = itemBuffer
      ? countItemType(itemBuffer, config.itemId.group, config.itemId.index)
      : 0;
  }

  const balance: DepositData["balance"] = depositRow
    ? {
        Zen: Number(depositRow.Zen),
        Rena: depositRow.Rena,
        JewelOfBless: depositRow.JewelOfBless,
        JewelOfSoul: depositRow.JewelOfSoul,
        JewelOfLife: depositRow.JewelOfLife,
        JewelOfCreation: depositRow.JewelOfCreation,
        JewelOfChaos: depositRow.JewelOfChaos,
      }
    : ZERO_BALANCE;

  return { warehouseZen, warehouseCounts, balance };
}
