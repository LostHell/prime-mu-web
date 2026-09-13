export const BYTES_PER_SLOT = 10;
export const EMPTY_SLOT_BYTE = 0xff;

export const ITEM_TYPE_GROUP_SIZE = 32;
/** +256 item type (Season 1 uses 0x80 on byte 7/9). */
export const ITEM_TYPE_EXTENDED_FLAG_MASK = 0x80;
/** Byte 9 0x08 from earlier website-minted blobs. */
export const ITEM_TYPE_EXTENDED_FLAG_LEGACY_MASK = 0x08;

export const ITEM_SKILL_MASK = 0x80;
export const ITEM_LUCK_MASK = 0x04;
export const ITEM_ADD_OPTION_MASK = 0x03;
export const ITEM_LEVEL_SHIFT = 3;
export const ITEM_LEVEL_MASK = 0x0f;
export const ITEM_EXCELLENT_MASK = 0x3f;
