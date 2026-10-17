import { decodeItem } from "./decode";

describe("decodeItem add option", () => {
  test("includes +16 from byte 7 extended option bit", () => {
    // group 0 index 0 sword: option tier 4 (+16), no excellent
    const bytes = Uint8Array.from([
      0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0x01, 0x40, 0x00, 0x00,
    ]);
    expect(decodeItem(bytes)).toMatchObject({
      group: 0,
      index: 0,
      addOption: 16,
      excellent: 0,
    });
  });

  test("combines low option bits with +16 extended bit", () => {
    // option tier 1 in b1 + extended → still only tiers 0–3 in b1; +16 is exclusive tier 4
    const bytes = Uint8Array.from([
      0x00, 0x03, 0xff, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00,
    ]);
    expect(decodeItem(bytes)).toMatchObject({ addOption: 12, excellent: 0 });
  });
});
