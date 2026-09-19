import {
  DEPOSIT_ITEM_TYPES,
  DEPOSITABLE_ITEMS,
  EMPTY_DEPOSIT_AMOUNTS,
  type DepositAmounts,
  type DepositItemType,
  type ItemIconId,
} from "@/constants/depositable-items";
import {
  countItemsByType,
  countPlaceableItems,
  getMaxWithdrawableWarehouseMoney,
  getWarehouseItemsBuffer,
} from "@/lib/game/warehouse";
import { depositAmountsFromColumns } from "@/lib/utils/deposits";
import { prisma } from "@/prisma/prisma";

export type ItemBalance = {
  type: DepositItemType;
  label: string;
  icon?: ItemIconId;
  warehouseCount: number;
  depositedCount: number;
  maxWithdrawable: number;
  withdrawBlockedReason: string | null;
};

export type DepositData = {
  isOffline: boolean;
  items: ItemBalance[];
};

export async function getAccountDepositAmounts(
  accountId: string,
): Promise<DepositAmounts> {
  const row = await prisma.accountDeposit.findUnique({
    where: { AccountID: accountId },
  });
  if (!row) return EMPTY_DEPOSIT_AMOUNTS;
  return depositAmountsFromColumns(row);
}

export async function getDeposits(accountId: string): Promise<DepositData> {
  const [warehouse, deposited, stat] = await Promise.all([
    prisma.warehouse.findUnique({
      where: { AccountID: accountId },
      select: { Items: true, Money: true },
    }),
    getAccountDepositAmounts(accountId),
    prisma.mEMB_STAT.findUnique({
      where: { memb___id: accountId },
      select: { ConnectStat: true },
    }),
  ]);

  const warehouseZen = warehouse?.Money ?? 0;
  const warehouseItems = getWarehouseItemsBuffer(warehouse?.Items);

  const items = DEPOSIT_ITEM_TYPES.map((type): ItemBalance => {
    const config = DEPOSITABLE_ITEMS[type];
    const depositedCount = deposited[type];

    if (type === "zen") {
      const maxWithdrawable = getMaxWithdrawableWarehouseMoney(
        depositedCount,
        warehouseZen,
      );
      return {
        type,
        label: config.label,
        icon: config.icon,
        warehouseCount: warehouseZen,
        depositedCount,
        maxWithdrawable,
        withdrawBlockedReason:
          depositedCount > 0 && maxWithdrawable === 0
            ? "Warehouse is at Zen capacity."
            : null,
      };
    }

    const { itemId } = config;
    const warehouseCount = itemId
      ? countItemsByType(warehouseItems, itemId)
      : 0;
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
