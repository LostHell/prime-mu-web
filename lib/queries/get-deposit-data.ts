import {
  DEPOSITABLE_ITEMS,
  DEPOSIT_ITEM_TYPES,
  type AccountDepositItemFields,
  type DepositItemType,
} from "@/constants/depositable-items";
import { countItemsByType } from "@/lib/game/warehouse";
import { bigIntToSafeNumber } from "@/lib/utils/numbers";
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
  const warehouseItems = warehouse?.Items
    ? Buffer.from(warehouse.Items)
    : null;

  const warehouseCounts = Object.fromEntries(
    DEPOSIT_ITEM_TYPES.map((type) => {
      const { itemId } = DEPOSITABLE_ITEMS[type];
      const count =
        warehouseItems && itemId
          ? countItemsByType(warehouseItems, itemId)
          : 0;
      return [type, count];
    }),
  ) as Record<DepositItemType, number>;

  const balance: DepositData["balance"] = depositRow
    ? {
        Zen: bigIntToSafeNumber(depositRow.Zen),
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
