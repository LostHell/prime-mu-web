import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
} from "@/lib/game/item-decoder/constants";
import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import { getWarehouseItemsBuffer } from "./get-warehouse-items-buffer";

describe("getWarehouseItemsBuffer", () => {
  test("returns an empty warehouse blob when items are missing", () => {
    const empty = getWarehouseItemsBuffer();
    expect(empty.length).toBe(WAREHOUSE_SLOTS * BYTES_PER_SLOT);
    expect(empty.every((byte) => byte === EMPTY_SLOT_BYTE)).toBe(true);
    expect(getWarehouseItemsBuffer(null).equals(empty)).toBe(true);
  });

  test("returns a copy of an existing items blob", () => {
    const original = Buffer.from([1, 2, 3, 4]);
    const copy = getWarehouseItemsBuffer(original);
    expect(copy.equals(original)).toBe(true);
    expect(copy).not.toBe(original);
  });
});
