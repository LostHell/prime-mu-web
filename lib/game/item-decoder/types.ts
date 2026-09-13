import { type ItemId } from "@/lib/game/item-database/types";

export type BinaryItemData = Buffer | Uint8Array;

export type DecodedItem = ItemId & {
  slot: number;
  skill: boolean;
  luck: boolean;
  addOption: number;
  excellent: number;
  durability: number;
  rawBytes: number[];
};
