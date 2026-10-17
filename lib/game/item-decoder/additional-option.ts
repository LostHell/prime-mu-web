import {
  FIRST_GEN_WING_MAX_INDEX,
  ITEM_GROUP,
  ITEM_INDEX,
  ITEM_WING_JOL_ALT_OPTION_BIT,
  SECOND_GEN_WING_MAX_INDEX,
  SECOND_GEN_WING_MIN_INDEX,
  WING_INDEX,
} from "./constants";

type AdditionalOptionItem = {
  group: number;
  index: number;
  addOption: number;
  excellent: number;
};

/**
 * JoL / Option3 kinds from 0.97k ItemOption.txt (option indexes 60–65).
 * `addOption` is the decoded tier×4 value (4 / 8 / 12 / 16).
 */
export const AdditionalOptionKind = {
  /** Option 60 — flat damage. */
  Damage: "damage",
  /** Option 61 — flat wizardry damage. */
  WizardryDamage: "wizardryDamage",
  /** Option 62 — defense rate % = (tier)×5. */
  DefenseRate: "defenseRate",
  /** Option 63 — flat defense. */
  Defense: "defense",
  /** Option 65 — HP recovery % = tier. */
  HpRecovery: "hpRecovery",
} as const;

export type AdditionalOptionKind =
  (typeof AdditionalOptionKind)[keyof typeof AdditionalOptionKind];

export type AdditionalOption = {
  kind: AdditionalOptionKind;
  /** Display value: flat points, or percent for `defenseRate` / `hpRecovery`. */
  value: number;
};

const VALUE_FROM_ADD_OPTION: Record<
  AdditionalOptionKind,
  (addOption: number) => number
> = {
  [AdditionalOptionKind.Damage]: (addOption) => addOption,
  [AdditionalOptionKind.WizardryDamage]: (addOption) => addOption,
  [AdditionalOptionKind.Defense]: (addOption) => addOption,
  [AdditionalOptionKind.DefenseRate]: (addOption) => (addOption / 4) * 5,
  [AdditionalOptionKind.HpRecovery]: (addOption) => addOption / 4,
};

/** Rings + pendants that take Option 65 (ItemOption.txt). */
const HP_RECOVERY_HELPER_INDEXES = new Set<number>([
  ITEM_INDEX.RingOfIce,
  ITEM_INDEX.RingOfPoison,
  ITEM_INDEX.PendantOfLightning,
  ITEM_INDEX.PendantOfFire,
]);

/** 1st-gen wings: fixed additional option (no ExceOption alternate). */
const FIRST_GEN_WING_KIND: Record<number, AdditionalOptionKind> = {
  [WING_INDEX.WingsOfElf]: AdditionalOptionKind.HpRecovery,
  [WING_INDEX.WingsOfHeaven]: AdditionalOptionKind.WizardryDamage,
  [WING_INDEX.WingsOfSatan]: AdditionalOptionKind.Damage,
};

/**
 * 2nd-gen wings: default vs ItemExceOption=32 alternate
 * (last matching ItemOption.txt row wins when the bit is set).
 */
const SECOND_GEN_WING_KIND: Record<
  number,
  { default: AdditionalOptionKind; alternate: AdditionalOptionKind }
> = {
  [WING_INDEX.WingsOfSpirits]: {
    default: AdditionalOptionKind.Damage,
    alternate: AdditionalOptionKind.HpRecovery,
  },
  [WING_INDEX.WingsOfSoul]: {
    default: AdditionalOptionKind.WizardryDamage,
    alternate: AdditionalOptionKind.HpRecovery,
  },
  [WING_INDEX.WingsOfDragon]: {
    default: AdditionalOptionKind.Damage,
    alternate: AdditionalOptionKind.HpRecovery,
  },
  [WING_INDEX.WingsOfDarkness]: {
    default: AdditionalOptionKind.Damage,
    alternate: AdditionalOptionKind.WizardryDamage,
  },
};

const resolveKind = (
  item: AdditionalOptionItem,
): AdditionalOptionKind | null => {
  if (item.group >= 0 && item.group <= 4) {
    return AdditionalOptionKind.Damage;
  }
  if (item.group === ITEM_GROUP.Staff) {
    return AdditionalOptionKind.WizardryDamage;
  }
  if (item.group === ITEM_GROUP.Shield) {
    return AdditionalOptionKind.DefenseRate;
  }
  if (item.group >= ITEM_GROUP.Helm && item.group <= ITEM_GROUP.Boots) {
    return AdditionalOptionKind.Defense;
  }
  if (item.group === ITEM_GROUP.Wing) {
    if (item.index <= FIRST_GEN_WING_MAX_INDEX) {
      return FIRST_GEN_WING_KIND[item.index] ?? null;
    }
    if (
      item.index >= SECOND_GEN_WING_MIN_INDEX &&
      item.index <= SECOND_GEN_WING_MAX_INDEX
    ) {
      const wing = SECOND_GEN_WING_KIND[item.index];
      if (!wing) return null;
      const useAlternate =
        (item.excellent & ITEM_WING_JOL_ALT_OPTION_BIT) !== 0;
      return useAlternate ? wing.alternate : wing.default;
    }
    return null;
  }
  if (
    item.group === ITEM_GROUP.Helper &&
    HP_RECOVERY_HELPER_INDEXES.has(item.index)
  ) {
    return AdditionalOptionKind.HpRecovery;
  }
  return null;
};

/** JoL / Option3 for an item, or null when the item has none. */
export const getAdditionalOption = (
  item: AdditionalOptionItem,
): AdditionalOption | null => {
  if (item.addOption <= 0) return null;

  const kind = resolveKind(item);
  if (!kind) return null;

  return {
    kind,
    value: VALUE_FROM_ADD_OPTION[kind](item.addOption),
  };
};
