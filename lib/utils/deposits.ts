import {
  DEPOSIT_ITEM_TYPES,
  type AccountDepositAmountFields,
  type AccountDepositItemFields,
  type DepositAmounts,
} from "@/constants/depositable-items";
import { bigIntToSafeNumber } from "./numbers";

/** Maps AccountDeposit / MarketplaceListing columns onto DepositItemType keys. */
export const depositAmountsFromColumns = (
  row: { Zen: number | bigint } & AccountDepositItemFields,
): DepositAmounts => ({
  zen: typeof row.Zen === "bigint" ? bigIntToSafeNumber(row.Zen) : row.Zen,
  rena: row.Rena,
  jewelOfBless: row.JewelOfBless,
  jewelOfSoul: row.JewelOfSoul,
  jewelOfLife: row.JewelOfLife,
  jewelOfCreation: row.JewelOfCreation,
  jewelOfChaos: row.JewelOfChaos,
});

/** Maps DepositItemType keys onto AccountDeposit / MarketplaceListing columns. */
export const depositColumnsFromAmounts = (
  amounts: DepositAmounts,
): AccountDepositAmountFields => ({
  Zen: amounts.zen,
  Rena: amounts.rena,
  JewelOfBless: amounts.jewelOfBless,
  JewelOfSoul: amounts.jewelOfSoul,
  JewelOfLife: amounts.jewelOfLife,
  JewelOfCreation: amounts.jewelOfCreation,
  JewelOfChaos: amounts.jewelOfChaos,
});

export const hasAnyPositiveDepositAmounts = (
  amounts: DepositAmounts,
): boolean => DEPOSIT_ITEM_TYPES.some((type) => amounts[type] > 0);
