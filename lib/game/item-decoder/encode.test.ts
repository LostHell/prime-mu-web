import { decodeItem } from "./decode";
import { createItemBytes } from "./encode";

describe("createItemBytes", () => {
  test("encodes a Jewel of Bless the game will accept", () => {
    const itemId = { group: 14, index: 13, level: 0 };
    const bytes = createItemBytes(itemId, 0x12345678, 1);

    expect(bytes).toEqual([
      205, 0x00, 0x01, 0x12, 0x34, 0x56, 0x78, 0x80, 0x00, 0x80,
    ]);
    expect(decodeItem(Uint8Array.from(bytes))).toMatchObject({
      ...itemId,
      durability: 1,
    });
  });
});
