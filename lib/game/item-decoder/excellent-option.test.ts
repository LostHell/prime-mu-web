import {
  ExcellentOptionKind,
  getExcellentOptions,
  isExcellentItem,
} from "./excellent-option";

describe("getExcellentOptions", () => {
  test("physical weapons use kayito bit order (0x01 = excellent damage)", () => {
    expect(
      getExcellentOptions({ group: 0, index: 0, excellent: 0x01 }),
    ).toEqual([
      {
        bit: 0x01,
        kind: ExcellentOptionKind.ExcellentDamageRate,
        value: 10,
      },
    ]);
    expect(
      getExcellentOptions({ group: 0, index: 0, excellent: 0x20 }),
    ).toEqual([{ bit: 0x20, kind: ExcellentOptionKind.HuntMana, value: 8 }]);
  });

  test("staffs use wizardry variants on bits 0x02 and 0x04", () => {
    expect(
      getExcellentOptions({ group: 5, index: 0, excellent: 0x02 | 0x04 }),
    ).toEqual([
      { bit: 0x02, kind: ExcellentOptionKind.WizardryByLevel, value: 20 },
      { bit: 0x04, kind: ExcellentOptionKind.WizardryPercent, value: 2 },
    ]);
  });

  test("armor uses kayito bit order (0x01 = max HP, 0x20 = zen)", () => {
    expect(
      getExcellentOptions({ group: 7, index: 0, excellent: 0x01 }),
    ).toEqual([{ bit: 0x01, kind: ExcellentOptionKind.MaxHp, value: 4 }]);
    expect(
      getExcellentOptions({ group: 6, index: 0, excellent: 0x20 }),
    ).toEqual([{ bit: 0x20, kind: ExcellentOptionKind.ZenDrop, value: 40 }]);
  });

  test("rings use the armor excellent table", () => {
    expect(
      getExcellentOptions({ group: 13, index: 8, excellent: 0x08 }),
    ).toEqual([
      { bit: 0x08, kind: ExcellentOptionKind.ReflectDamage, value: 5 },
    ]);
    expect(
      getExcellentOptions({ group: 13, index: 9, excellent: 0x10 }),
    ).toEqual([
      { bit: 0x10, kind: ExcellentOptionKind.DefenseSuccessRate, value: 10 },
    ]);
  });

  test("Pendant of Lightning uses the staff table", () => {
    expect(
      getExcellentOptions({ group: 13, index: 12, excellent: 0x02 }),
    ).toEqual([
      { bit: 0x02, kind: ExcellentOptionKind.WizardryByLevel, value: 20 },
    ]);
  });

  test("Pendant of Fire uses the physical weapon table", () => {
    expect(
      getExcellentOptions({ group: 13, index: 13, excellent: 0x02 }),
    ).toEqual([
      { bit: 0x02, kind: ExcellentOptionKind.DamageByLevel, value: 20 },
    ]);
  });

  test("2nd-gen wings ignore JoL alternate bit 0x20", () => {
    expect(
      getExcellentOptions({ group: 12, index: 3, excellent: 0x20 }),
    ).toEqual([]);
    expect(
      getExcellentOptions({
        group: 12,
        index: 5,
        excellent: 0x01 | 0x10 | 0x20,
      }),
    ).toEqual([
      { bit: 0x01, kind: ExcellentOptionKind.WingHp, value: 5 },
      { bit: 0x10, kind: ExcellentOptionKind.AttackSpeed, value: 5 },
    ]);
  });

  test("1st-gen wings have no excellent options", () => {
    expect(
      getExcellentOptions({ group: 12, index: 0, excellent: 0x1f }),
    ).toEqual([]);
  });

  test("dinorant uses its own three-option table", () => {
    expect(
      getExcellentOptions({
        group: 13,
        index: 3,
        excellent: 0x01 | 0x02 | 0x04,
      }),
    ).toEqual([
      { bit: 0x01, kind: ExcellentOptionKind.AbsorbDamage, value: 5 },
      { bit: 0x02, kind: ExcellentOptionKind.MaxAg, value: 50 },
      { bit: 0x04, kind: ExcellentOptionKind.AttackSpeed, value: 5 },
    ]);
  });

  test("items without an excellent table return nothing", () => {
    expect(
      getExcellentOptions({ group: 13, index: 0, excellent: 0x3f }),
    ).toEqual([]);
  });
});

describe("isExcellentItem", () => {
  test("dinorant is never named Excellent", () => {
    expect(isExcellentItem({ group: 13, index: 3, excellent: 0x07 })).toBe(
      false,
    );
  });

  test("2nd-gen wing with only JoL bit is not Excellent", () => {
    expect(isExcellentItem({ group: 12, index: 4, excellent: 0x20 })).toBe(
      false,
    );
  });

  test("armor with any excellent bit is Excellent", () => {
    expect(isExcellentItem({ group: 8, index: 0, excellent: 0x01 })).toBe(true);
  });
});
