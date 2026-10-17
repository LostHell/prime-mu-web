import { AdditionalOptionKind } from "./additional-option";
import { ExcellentOptionKind } from "./excellent-option";
import {
  formatAdditionalOption,
  formatExcellentOption,
  LUCK_OPTION_LINES,
} from "./formatters";

describe("formatAdditionalOption", () => {
  test("formats each JoL kind with its ItemOption.txt style label", () => {
    expect(
      formatAdditionalOption({
        kind: AdditionalOptionKind.Damage,
        value: 12,
      }),
    ).toBe("Additional Damage +12");
    expect(
      formatAdditionalOption({
        kind: AdditionalOptionKind.WizardryDamage,
        value: 8,
      }),
    ).toBe("Additional Wizardry Dmg +8");
    expect(
      formatAdditionalOption({
        kind: AdditionalOptionKind.Defense,
        value: 4,
      }),
    ).toBe("Additional defense +4");
    expect(
      formatAdditionalOption({
        kind: AdditionalOptionKind.DefenseRate,
        value: 10,
      }),
    ).toBe("Additional defense rate +10%");
    expect(
      formatAdditionalOption({
        kind: AdditionalOptionKind.HpRecovery,
        value: 3,
      }),
    ).toBe("Automatic HP recovery 3%");
  });
});

describe("formatExcellentOption", () => {
  test("formats armor, weapon, and wing excellent labels", () => {
    expect(
      formatExcellentOption({
        kind: ExcellentOptionKind.MaxHp,
        bit: 0x01,
        value: 4,
      }),
    ).toBe("Increase Max HP +4%");
    expect(
      formatExcellentOption({
        kind: ExcellentOptionKind.DamageByLevel,
        bit: 0x02,
        value: 20,
      }),
    ).toBe("Increase Damage +level/20");
    expect(
      formatExcellentOption({
        kind: ExcellentOptionKind.AttackSpeed,
        bit: 0x10,
        value: 5,
      }),
    ).toBe("Increase Attacking(Wizardry) speed +5");
  });
});

describe("LUCK_OPTION_LINES", () => {
  test("lists both classic luck lines", () => {
    expect(LUCK_OPTION_LINES).toHaveLength(2);
  });
});
