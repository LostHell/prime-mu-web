import "server-only";

export {
  BYTES_PER_SLOT,
  EMPTY_SLOT_BYTE,
  ITEM_SERIAL_BYTES,
  ITEM_SERIAL_OFFSET,
  MAX_ITEM_SERIAL,
} from "./constants";
export { decodeItem, decodeItems, getItemSerial } from "./decode";
export { createItemBytes } from "./encode";
export { clearWarehouseSlot, writeItemToSlot } from "./slots";
export { findFreeArea, findFreeAreas } from "./space";
