import { createItemBytes } from "./encode";

describe("createItemBytes", () => {
  test("encodes a Jewel of Bless the game will accept", () => {
    expect(
      createItemBytes({ group: 14, index: 13, level: 0 }, 0x12345678, 1),
    ).toEqual([205, 0x00, 0x01, 0x12, 0x34, 0x56, 0x78, 0x00, 0x00, 0x08]);
  });
});
