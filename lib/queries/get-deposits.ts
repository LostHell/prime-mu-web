import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  type AccountDepositItemFields,
  type DepositItemType,
  type ItemIconId,
} from "@/constants/depositable-items";
import {
  countItemsByType,
  countPlaceableItems,
  getMaxWithdrawableWarehouseMoney,
  getWarehouseItemsBuffer,
} from "@/lib/game/warehouse";
import { bigIntToSafeNumber } from "@/lib/utils/numbers";
import { prisma } from "@/prisma/prisma";

export type ItemBalance = {
  type: DepositItemType;
  label: string;
  icon: ItemIconId;
  warehouseCount: number;
  depositedCount: number;
  maxWithdrawable: number;
  withdrawBlockedReason: string | null;
};

export type DepositData = {
  isOffline: boolean;
  items: ItemBalance[];
};

type DepositBalance = { Zen: number } & AccountDepositItemFields;

const ZERO_BALANCE: DepositBalance = {
  Zen: 0,
  Rena: 0,
  JewelOfBless: 0,
  JewelOfSoul: 0,
  JewelOfLife: 0,
  JewelOfCreation: 0,
  JewelOfChaos: 0,
};

export async function getDeposits(accountId: string): Promise<DepositData> {
  const [warehouse, depositRow, stat] = await Promise.all([
    prisma.warehouse.findUnique({
      where: { AccountID: accountId },
      select: { Items: true, Money: true },
    }),
    prisma.accountDeposit.findUnique({
      where: { AccountID: accountId },
    }),
    prisma.mEMB_STAT.findUnique({
      where: { memb___id: accountId },
      select: { ConnectStat: true },
    }),
  ]);

  const warehouseZen = warehouse?.Money ?? 0;
  const warehouseItems = getWarehouseItemsBuffer(warehouse?.Items);
  const balance: DepositBalance = depositRow
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

  const items = DEPOSIT_ITEM_TYPES.map((type): ItemBalance => {
    const config = DEPOSITABLE_ITEMS[type];

    if (type === "zen") {
      const maxWithdrawable = getMaxWithdrawableWarehouseMoney(
        balance.Zen,
        warehouseZen,
      );
      return {
        type,
        label: config.label,
        icon: config.icon,
        warehouseCount: warehouseZen,
        depositedCount: balance.Zen,
        maxWithdrawable,
        withdrawBlockedReason:
          balance.Zen > 0 && maxWithdrawable === 0
            ? "Warehouse is at Zen capacity."
            : null,
      };
    }

    const { itemId, dbField } = config;
    const warehouseCount = itemId
      ? countItemsByType(warehouseItems, itemId)
      : 0;
    const depositedCount = dbField ? balance[dbField] : 0;
    const maxWithdrawable = itemId
      ? countPlaceableItems(warehouseItems, itemId, depositedCount)
      : 0;

    return {
      type,
      label: config.label,
      icon: config.icon,
      warehouseCount,
      depositedCount,
      maxWithdrawable,
      withdrawBlockedReason:
        depositedCount > 0 && maxWithdrawable === 0
          ? "Not enough space in warehouse."
          : null,
    };
  });

  return {
    isOffline: (stat?.ConnectStat ?? 0) === 0,
    items,
  };
}
