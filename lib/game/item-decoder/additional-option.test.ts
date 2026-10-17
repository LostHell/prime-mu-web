import { AdditionalOptionKind, getAdditionalOption } from "./additional-option";

describe("getAdditionalOption", () => {
  test("physical weapons resolve to flat damage", () => {
    expect(
      getAdditionalOption({
        group: 0,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.Damage, value: 12 });
  });

  test("staffs resolve to wizardry damage", () => {
    expect(
      getAdditionalOption({
        group: 5,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.WizardryDamage, value: 12 });
  });

  test("shields resolve to defense rate percent", () => {
    expect(
      getAdditionalOption({
        group: 6,
        index: 0,
        addOption: 8,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.DefenseRate, value: 10 });
  });

  test("armor resolves to additional defense", () => {
    expect(
      getAdditionalOption({
        group: 7,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.Defense, value: 12 });
  });

  test("1st-gen wings use fixed option kinds", () => {
    expect(
      getAdditionalOption({
        group: 12,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.HpRecovery, value: 3 });
    expect(
      getAdditionalOption({
        group: 12,
        index: 1,
        addOption: 16,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.WizardryDamage, value: 16 });
    expect(
      getAdditionalOption({
        group: 12,
        index: 2,
        addOption: 8,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.Damage, value: 8 });
  });

  test("Wings of Spirits use NewOption bit 0x20 for HP recovery", () => {
    expect(
      getAdditionalOption({
        group: 12,
        index: 3,
        addOption: 8,
        excellent: 0x20,
      }),
    ).toEqual({ kind: AdditionalOptionKind.HpRecovery, value: 2 });
    expect(
      getAdditionalOption({
        group: 12,
        index: 3,
        addOption: 8,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.Damage, value: 8 });
  });

  test("Wings of Soul default to wizardry, alt bit to HP recovery", () => {
    expect(
      getAdditionalOption({
        group: 12,
        index: 4,
        addOption: 4,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.WizardryDamage, value: 4 });
    expect(
      getAdditionalOption({
        group: 12,
        index: 4,
        addOption: 4,
        excellent: 0x20,
      }),
    ).toEqual({ kind: AdditionalOptionKind.HpRecovery, value: 1 });
  });

  test("Wings of Darkness default to damage, alt bit to wizardry", () => {
    expect(
      getAdditionalOption({
        group: 12,
        index: 6,
        addOption: 12,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.Damage, value: 12 });
    expect(
      getAdditionalOption({
        group: 12,
        index: 6,
        addOption: 12,
        excellent: 0x20,
      }),
    ).toEqual({ kind: AdditionalOptionKind.WizardryDamage, value: 12 });
  });

  test("rings and pendants resolve to HP recovery", () => {
    expect(
      getAdditionalOption({
        group: 13,
        index: 8,
        addOption: 4,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.HpRecovery, value: 1 });
    expect(
      getAdditionalOption({
        group: 13,
        index: 12,
        addOption: 8,
        excellent: 0,
      }),
    ).toEqual({ kind: AdditionalOptionKind.HpRecovery, value: 2 });
  });

  test("returns null when there is no additional option", () => {
    expect(
      getAdditionalOption({
        group: 0,
        index: 0,
        addOption: 0,
        excellent: 0,
      }),
    ).toBeNull();
  });

  test("returns null for items with no ItemOption.txt additional row", () => {
    expect(
      getAdditionalOption({
        group: 14,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toBeNull();
    expect(
      getAdditionalOption({
        group: 13,
        index: 0,
        addOption: 12,
        excellent: 0,
      }),
    ).toBeNull();
  });
});
