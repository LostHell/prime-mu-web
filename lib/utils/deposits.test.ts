import { EMPTY_DEPOSIT_AMOUNTS } from "@/constants/depositable-items";
import {
  depositAmountsFromColumns,
  depositColumnsFromAmounts,
  hasAnyPositiveDepositAmounts,
} from "./deposits";

describe("depositAmountsFromColumns", () => {
  test("maps deposit columns onto DepositItemType keys", () => {
    expect(
      depositAmountsFromColumns({
        Zen: 500,
        Rena: 1,
        JewelOfBless: 10,
        JewelOfSoul: 0,
        JewelOfLife: 0,
        JewelOfCreation: 0,
        JewelOfChaos: 2,
      }),
    ).toEqual({
      ...EMPTY_DEPOSIT_AMOUNTS,
      zen: 500,
      rena: 1,
      jewelOfBless: 10,
      jewelOfChaos: 2,
    });
  });

  test("converts bigint Zen to a number", () => {
    expect(
      depositAmountsFromColumns({
        Zen: 500n,
        Rena: 0,
        JewelOfBless: 0,
        JewelOfSoul: 0,
        JewelOfLife: 0,
        JewelOfCreation: 0,
        JewelOfChaos: 0,
      }).zen,
    ).toBe(500);
  });
});

describe("depositColumnsFromAmounts", () => {
  test("maps DepositItemType keys onto deposit columns", () => {
    expect(
      depositColumnsFromAmounts({
        ...EMPTY_DEPOSIT_AMOUNTS,
        jewelOfBless: 3,
      }),
    ).toEqual({
      Zen: 0,
      Rena: 0,
      JewelOfBless: 3,
      JewelOfSoul: 0,
      JewelOfLife: 0,
      JewelOfCreation: 0,
      JewelOfChaos: 0,
    });
  });
});

describe("hasAnyPositiveDepositAmounts", () => {
  test("is true when at least one currency is greater than zero", () => {
    expect(hasAnyPositiveDepositAmounts(EMPTY_DEPOSIT_AMOUNTS)).toBe(false);
    expect(
      hasAnyPositiveDepositAmounts({ ...EMPTY_DEPOSIT_AMOUNTS, rena: 1 }),
    ).toBe(true);
  });
});
