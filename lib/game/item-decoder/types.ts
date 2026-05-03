export type BinaryItemData = Buffer | Uint8Array;

export type DecodedItem = {
  slot: number;
  group: number;
  index: number;
  level: number;
  skill: boolean;
  luck: boolean;
  addOption: number;
  excellent: number;
  durability: number;
  rawBytes: number[];
};
