export const BYTES_PER_SLOT = 10;
export const EMPTY_SLOT_BYTE = 0xff;
export const MAX_ITEM_SERIAL = 2_147_483_647;

/** A MU item stores its four-byte, big-endian serial at bytes 3–6. */
export const ITEM_SERIAL_OFFSET = 3;
export const ITEM_SERIAL_BYTES = 4;
export const BYTE_RADIX = 0x100;

export const ITEM_TYPE_GROUP_SIZE = 32;
/** Byte 7: item type +256. Confirmed on in-game Bless/Soul/Life jewels. */
export const ITEM_TYPE_EXTENDED_FLAG_MASK = 0x80;

export const ITEM_SKILL_MASK = 0x80;
export const ITEM_LUCK_MASK = 0x04;
export const ITEM_ADD_OPTION_MASK = 0x03;
/** Byte 7: Jewel of Life option level +16 (option tier 4). */
export const ITEM_ADD_OPTION_EXTENDED_MASK = 0x40;
export const ITEM_LEVEL_SHIFT = 3;
export const ITEM_LEVEL_MASK = 0x0f;
export const ITEM_EXCELLENT_MASK = 0x3f;
/**
 * On 2nd-gen wings, NewOption bit 0x20 selects the alternate JoL option
 * (HP recovery or wizardry) per ItemOption.txt — not an excellent effect.
 */
export const ITEM_WING_JOL_ALT_OPTION_BIT = 0x20;

/** Item.txt group numbers used by option resolution. */
export const ITEM_GROUP = {
  Staff: 5,
  Shield: 6,
  Helm: 7,
  Boots: 11,
  Wing: 12,
  Helper: 13,
} as const;

/** Group 13 indexes that carry excellent / additional options (ItemOption.txt). */
export const ITEM_INDEX = {
  Dinorant: 3,
  RingOfIce: 8,
  RingOfPoison: 9,
  PendantOfLightning: 12,
  PendantOfFire: 13,
} as const;

export const WING_INDEX = {
  WingsOfElf: 0,
  WingsOfHeaven: 1,
  WingsOfSatan: 2,
  WingsOfSpirits: 3,
  WingsOfSoul: 4,
  WingsOfDragon: 5,
  WingsOfDarkness: 6,
} as const;

export const FIRST_GEN_WING_MAX_INDEX = WING_INDEX.WingsOfSatan;
export const SECOND_GEN_WING_MIN_INDEX = WING_INDEX.WingsOfSpirits;
export const SECOND_GEN_WING_MAX_INDEX = WING_INDEX.WingsOfDarkness;
