import { MAX_WAREHOUSE_MONEY } from "@/lib/game/constants/warehouse";
import { getMaxWithdrawableWarehouseMoney } from "./get-max-withdrawable-warehouse-money";

describe("getMaxWithdrawableWarehouseMoney", () => {
  test("caps at remaining warehouse capacity", () => {
    expect(
      getMaxWithdrawableWarehouseMoney(1_000, MAX_WAREHOUSE_MONEY - 250),
    ).toBe(250);
  });

  test("returns 0 when the warehouse is already at capacity", () => {
    expect(getMaxWithdrawableWarehouseMoney(5_000, MAX_WAREHOUSE_MONEY)).toBe(
      0,
    );
  });

  test("returns the deposited amount when it fits", () => {
    expect(getMaxWithdrawableWarehouseMoney(100, 50)).toBe(100);
  });
});
