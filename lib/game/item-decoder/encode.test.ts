import { decodeItem, getItemSerial } from "./decode";
import { createItemBytes } from "./encode";

describe("createItemBytes", () => {
  test("matches in-game warehouse bytes for Jewel of Bless", () => {
    const itemId = { group: 14, index: 13, level: 0 };
    const bytes = createItemBytes(itemId, 0x0005e79d, 1);

    expect(bytes).toEqual([
      0xcd, 0x00, 0x01, 0x00, 0x05, 0xe7, 0x9d, 0x80, 0x00, 0x0e,
    ]);
    expect(getItemSerial(Uint8Array.from(bytes))).toBe(0x0005e79d);
    expect(decodeItem(Uint8Array.from(bytes))).toMatchObject({
      ...itemId,
      durability: 1,
      serial: 0x0005e79d,
    });
  });

  test("matches in-game warehouse bytes for Jewel of Soul and Life", () => {
    expect(
      createItemBytes({ group: 14, index: 14, level: 0 }, 0x0005e7a4, 1),
    ).toEqual([0xce, 0x00, 0x01, 0x00, 0x05, 0xe7, 0xa4, 0x80, 0x00, 0x0e]);
    expect(
      createItemBytes({ group: 14, index: 16, level: 0 }, 0x0005e7a9, 1),
    ).toEqual([0xd0, 0x00, 0x01, 0x00, 0x05, 0xe7, 0xa9, 0x80, 0x00, 0x0e]);
  });
});
