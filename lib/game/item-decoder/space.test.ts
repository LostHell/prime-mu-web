import { findFreeArea } from "./space";
import { WAREHOUSE_SLOTS } from "@/lib/game/constants/warehouse";
import { BYTES_PER_SLOT, EMPTY_SLOT_BYTE } from "./constants";

jest.mock("@/lib/game/item-database", () => ({
  getItemDefinition: () => undefined,
}));

test("refuses to place items when an existing item's dimensions are unknown", () => {
  const warehouse = Buffer.alloc(
    WAREHOUSE_SLOTS * BYTES_PER_SLOT,
    EMPTY_SLOT_BYTE,
  );
  warehouse.fill(0, 0, BYTES_PER_SLOT);
  expect(() => findFreeArea(warehouse, 1, 1)).toThrow(/unsupported item/);
});

test("refuses truncated warehouse data instead of treating missing slots as empty", () => {
  expect(() => findFreeArea(Buffer.alloc(10, EMPTY_SLOT_BYTE), 1, 1)).toThrow(
    /cannot be safely read/,
  );
});
