import {
  AdditionalOptionKind,
  type AdditionalOption,
} from "./additional-option";
import { ExcellentOptionKind, type ExcellentOption } from "./excellent-option";

/** Shown when `DecodedItem.luck` is true (classic MU lists both). */
export const LUCK_OPTION_LINES = [
  "Luck (success rate of Jewel of Soul +25%)",
  "Luck (critical damage rate +5%)",
] as const;

/** Labels for JoL / Option3 kinds (ItemOption.txt indexes 60–65). */
const ADDITIONAL_OPTION_LABEL: Record<
  AdditionalOptionKind,
  (value: number) => string
> = {
  [AdditionalOptionKind.Damage]: (v) => `Additional Damage +${v}`,
  [AdditionalOptionKind.WizardryDamage]: (v) => `Additional Wizardry Dmg +${v}`,
  [AdditionalOptionKind.Defense]: (v) => `Additional defense +${v}`,
  [AdditionalOptionKind.DefenseRate]: (v) => `Additional defense rate +${v}%`,
  [AdditionalOptionKind.HpRecovery]: (v) => `Automatic HP recovery ${v}%`,
};

/** Labels for excellent / NewOption kinds (ItemOption.txt indexes 66–84). */
const EXCELLENT_OPTION_LABEL: Record<
  ExcellentOptionKind,
  (value: number) => string
> = {
  [ExcellentOptionKind.MaxHp]: (v) => `Increase Max HP +${v}%`,
  [ExcellentOptionKind.MaxMana]: (v) => `Increase Max Mana +${v}%`,
  [ExcellentOptionKind.DamageDecrease]: (v) => `Damage Decrease +${v}%`,
  [ExcellentOptionKind.ReflectDamage]: (v) => `Reflect Damage +${v}%`,
  [ExcellentOptionKind.DefenseSuccessRate]: (v) =>
    `Defense success rate +${v}%`,
  [ExcellentOptionKind.ZenDrop]: (v) =>
    `Increase Zen after hunting monsters +${v}%`,
  [ExcellentOptionKind.ExcellentDamageRate]: (v) =>
    `Excellent Damage rate +${v}%`,
  [ExcellentOptionKind.DamageByLevel]: (v) => `Increase Damage +level/${v}`,
  [ExcellentOptionKind.DamagePercent]: (v) => `Increase Damage +${v}%`,
  [ExcellentOptionKind.WizardryByLevel]: (v) =>
    `Increase Wizardry Dmg +level/${v}`,
  [ExcellentOptionKind.WizardryPercent]: (v) => `Increase Wizardry Dmg +${v}%`,
  [ExcellentOptionKind.AttackSpeed]: (v) =>
    `Increase Attacking(Wizardry) speed +${v}`,
  [ExcellentOptionKind.HuntLife]: () => `Increases life after hunt +life/8`,
  [ExcellentOptionKind.HuntMana]: () => `Increases mana after hunt +mana/8`,
  [ExcellentOptionKind.WingHp]: (v) => `HP +${v} increased`,
  [ExcellentOptionKind.WingMana]: (v) => `Mana +${v} increased`,
  [ExcellentOptionKind.IgnoreDefense]: (v) =>
    `Ignore opponent's defensive power by ${v}%`,
  [ExcellentOptionKind.MaxAg]: (v) => `Max AG +${v} increased`,
  [ExcellentOptionKind.AbsorbDamage]: (v) => `Absorb ${v}% additional damage`,
};

export const formatAdditionalOption = (option: AdditionalOption): string =>
  ADDITIONAL_OPTION_LABEL[option.kind](option.value);

export const formatExcellentOption = (option: ExcellentOption): string =>
  EXCELLENT_OPTION_LABEL[option.kind](option.value);
