import {
  DEPOSITABLE_ITEM_DURABILITY,
  DEPOSITABLE_ITEMS,
} from "@/constants/depositable-items";
import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  writeItemToSlot,
} from "@/lib/game/item-decoder";
import { createItemBytes } from "@/lib/game/item-decoder/encode";
import { countPlaceableItems } from "./count-placeable-items";
import { getWarehouseItemsBuffer } from "./get-warehouse-items-buffer";

const blessId = DEPOSITABLE_ITEMS.jewelOfBless.itemId!;
const soulId = DEPOSITABLE_ITEMS.jewelOfSoul.itemId!;

describe("countPlaceableItems", () => {
  test("returns 0 when nothing is requested", () => {
    expect(countPlaceableItems(getWarehouseItemsBuffer(), blessId, 0)).toBe(0);
  });

  test("caps 1x1 items at the number of warehouse slots", () => {
    expect(
      countPlaceableItems(
        getWarehouseItemsBuffer(),
        blessId,
        WAREHOUSE_SLOTS + 50,
      ),
    ).toBe(WAREHOUSE_SLOTS);
  });

  test("returns 0 when the warehouse has no free space", () => {
    const itemBytes = Uint8Array.from(
      createItemBytes(blessId, 1, DEPOSITABLE_ITEM_DURABILITY),
    );
    const items = Array.from(
      { length: WAREHOUSE_SLOTS },
      (_, slot) => slot,
    ).reduce<Buffer>(
      (buf, slot) => writeItemToSlot(buf, slot, itemBytes),
      Buffer.alloc(WAREHOUSE_SLOTS * BYTES_PER_SLOT, EMPTY_SLOT_BYTE),
    );

    expect(countPlaceableItems(items, soulId, 10)).toBe(0);
  });
});
