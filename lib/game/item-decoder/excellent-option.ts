import {
  ITEM_GROUP,
  ITEM_INDEX,
  ITEM_WING_JOL_ALT_OPTION_BIT,
  SECOND_GEN_WING_MAX_INDEX,
  SECOND_GEN_WING_MIN_INDEX,
} from "./constants";

type ExcellentOptionItem = {
  group: number;
  index: number;
  excellent: number;
};

/**
 * Excellent / NewOption kinds from 0.97k ItemOption.txt (option indexes 66–84).
 * Bit order matches kayito ItemExceOption values: 1, 2, 4, 8, 16, 32.
 */
export const ExcellentOptionKind = {
  MaxHp: "maxHp",
  MaxMana: "maxMana",
  DamageDecrease: "damageDecrease",
  ReflectDamage: "reflectDamage",
  DefenseSuccessRate: "defenseSuccessRate",
  ZenDrop: "zenDrop",
  ExcellentDamageRate: "excellentDamageRate",
  DamageByLevel: "damageByLevel",
  DamagePercent: "damagePercent",
  WizardryByLevel: "wizardryByLevel",
  WizardryPercent: "wizardryPercent",
  AttackSpeed: "attackSpeed",
  HuntLife: "huntLife",
  HuntMana: "huntMana",
  WingHp: "wingHp",
  WingMana: "wingMana",
  IgnoreDefense: "ignoreDefense",
  MaxAg: "maxAg",
  AbsorbDamage: "absorbDamage",
} as const;

export type ExcellentOptionKind =
  (typeof ExcellentOptionKind)[keyof typeof ExcellentOptionKind];

export type ExcellentOption = {
  kind: ExcellentOptionKind;
  bit: number;
  /** OptionValue from ItemOption.txt (percent, divisor, or flat). */
  value: number;
};

/** Groups 6–11 + rings (13,8 / 13,9). */
const ARMOR_EXCELLENT: ExcellentOption[] = [
  { bit: 0x01, kind: ExcellentOptionKind.MaxHp, value: 4 },
  { bit: 0x02, kind: ExcellentOptionKind.MaxMana, value: 4 },
  { bit: 0x04, kind: ExcellentOptionKind.DamageDecrease, value: 4 },
  { bit: 0x08, kind: ExcellentOptionKind.ReflectDamage, value: 5 },
  { bit: 0x10, kind: ExcellentOptionKind.DefenseSuccessRate, value: 10 },
  { bit: 0x20, kind: ExcellentOptionKind.ZenDrop, value: 40 },
];

/** Groups 0–4 + Pendant of Fire (13,13). */
const PHYSICAL_WEAPON_EXCELLENT: ExcellentOption[] = [
  { bit: 0x01, kind: ExcellentOptionKind.ExcellentDamageRate, value: 10 },
  { bit: 0x02, kind: ExcellentOptionKind.DamageByLevel, value: 20 },
  { bit: 0x04, kind: ExcellentOptionKind.DamagePercent, value: 2 },
  { bit: 0x08, kind: ExcellentOptionKind.AttackSpeed, value: 7 },
  { bit: 0x10, kind: ExcellentOptionKind.HuntLife, value: 8 },
  { bit: 0x20, kind: ExcellentOptionKind.HuntMana, value: 8 },
];

/** Group 5 + Pendant of Lightning (13,12). */
const STAFF_WEAPON_EXCELLENT: ExcellentOption[] = [
  { bit: 0x01, kind: ExcellentOptionKind.ExcellentDamageRate, value: 10 },
  { bit: 0x02, kind: ExcellentOptionKind.WizardryByLevel, value: 20 },
  { bit: 0x04, kind: ExcellentOptionKind.WizardryPercent, value: 2 },
  { bit: 0x08, kind: ExcellentOptionKind.AttackSpeed, value: 7 },
  { bit: 0x10, kind: ExcellentOptionKind.HuntLife, value: 8 },
  { bit: 0x20, kind: ExcellentOptionKind.HuntMana, value: 8 },
];

/**
 * 2nd-gen wings (12,3–12,6). Bit 0x20 is JoL alternate, not an excellent effect.
 */
const WING_EXCELLENT: ExcellentOption[] = [
  { bit: 0x01, kind: ExcellentOptionKind.WingHp, value: 5 },
  { bit: 0x02, kind: ExcellentOptionKind.WingMana, value: 5 },
  { bit: 0x04, kind: ExcellentOptionKind.IgnoreDefense, value: 3 },
  { bit: 0x08, kind: ExcellentOptionKind.MaxAg, value: 50 },
  { bit: 0x10, kind: ExcellentOptionKind.AttackSpeed, value: 5 },
];

/** Dinorant (13,3). Uses NewOption bits but is not an "Excellent" item name. */
const DINORANT_EXCELLENT: ExcellentOption[] = [
  { bit: 0x01, kind: ExcellentOptionKind.AbsorbDamage, value: 5 },
  { bit: 0x02, kind: ExcellentOptionKind.MaxAg, value: 50 },
  { bit: 0x04, kind: ExcellentOptionKind.AttackSpeed, value: 5 },
];

const RING_INDEXES = new Set<number>([
  ITEM_INDEX.RingOfIce,
  ITEM_INDEX.RingOfPoison,
]);

const isSecondGenWing = (item: ExcellentOptionItem): boolean =>
  item.group === ITEM_GROUP.Wing &&
  item.index >= SECOND_GEN_WING_MIN_INDEX &&
  item.index <= SECOND_GEN_WING_MAX_INDEX;

const getExcellentOptionTable = (
  item: ExcellentOptionItem,
): ExcellentOption[] | null => {
  if (item.group >= 0 && item.group <= 4) {
    return PHYSICAL_WEAPON_EXCELLENT;
  }
  if (item.group === ITEM_GROUP.Staff) {
    return STAFF_WEAPON_EXCELLENT;
  }
  if (item.group >= ITEM_GROUP.Shield && item.group <= ITEM_GROUP.Boots) {
    return ARMOR_EXCELLENT;
  }
  if (isSecondGenWing(item)) {
    return WING_EXCELLENT;
  }
  if (item.group === ITEM_GROUP.Helper) {
    if (item.index === ITEM_INDEX.Dinorant) {
      return DINORANT_EXCELLENT;
    }
    if (RING_INDEXES.has(item.index)) {
      return ARMOR_EXCELLENT;
    }
    if (item.index === ITEM_INDEX.PendantOfLightning) {
      return STAFF_WEAPON_EXCELLENT;
    }
    if (item.index === ITEM_INDEX.PendantOfFire) {
      return PHYSICAL_WEAPON_EXCELLENT;
    }
  }
  return null;
};

const excellentBitsForItem = (item: ExcellentOptionItem): number => {
  if (isSecondGenWing(item)) {
    return item.excellent & ~ITEM_WING_JOL_ALT_OPTION_BIT;
  }
  return item.excellent;
};

/** Active excellent options for an item, ordered low-bit → high-bit. */
export const getExcellentOptions = (
  item: ExcellentOptionItem,
): ExcellentOption[] => {
  const table = getExcellentOptionTable(item);
  if (!table || item.excellent <= 0) return [];

  const bits = excellentBitsForItem(item);
  return table.filter((option) => (bits & option.bit) !== 0);
};

/**
 * Whether the item should show the "Excellent" name prefix.
 * Mirrors GameServer `CItem::IsExcItem`, except 2nd-gen wing bit 0x20 alone
 * does not count (JoL alternate, not an excellent effect).
 */
export const isExcellentItem = (item: ExcellentOptionItem): boolean => {
  if (item.group === ITEM_GROUP.Helper && item.index === ITEM_INDEX.Dinorant) {
    return false;
  }
  return excellentBitsForItem(item) > 0;
};
