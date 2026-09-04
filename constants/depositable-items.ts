import { type ItemId } from "@/lib/game/item-database/types";

export type DepositItemType =
  | "zen"
  | "rena"
  | "jewelOfBless"
  | "jewelOfSoul"
  | "jewelOfLife"
  | "jewelOfCreation"
  | "jewelOfChaos";

export type ItemIconId = { group: number; index: number };

export type DepositItemConfig = {
  label: string;
  /** Icon used to render this item (all depositable items map to a real in-game item). */
  icon: ItemIconId;
  /** Field name on AccountDeposit model. Undefined for zen (handled separately). */
  dbField?: keyof AccountDepositItemFields;
  /** Exact warehouse binary representation (group+index+level) to match/create.
   * Undefined for zen (not a binary item; uses warehouse.Money). `level` is
   * required (not defaulted) so adding an item that isn't a fresh/level-0
   * instance -- e.g. a specific "Box of Kundun +5" -- is a deliberate, visible
   * choice here rather than an assumption baked into the deposit/withdraw code. */
  itemId?: ItemId;
};

/** The item count fields on AccountDeposit (excludes AccountID and Zen). */
export type AccountDepositItemFields = {
  Rena: number;
  JewelOfBless: number;
  JewelOfSoul: number;
  JewelOfLife: number;
  JewelOfCreation: number;
  JewelOfChaos: number;
};

export const DEPOSITABLE_ITEMS: Record<DepositItemType, DepositItemConfig> = {
  zen: {
    label: "Zen",
    icon: { group: 14, index: 15 },
  },
  rena: {
    label: "Rena",
    icon: { group: 14, index: 21 },
    dbField: "Rena",
    itemId: { group: 14, index: 21, level: 0 },
  },
  jewelOfBless: {
    label: "Jewel of Bless",
    icon: { group: 14, index: 13 },
    dbField: "JewelOfBless",
    itemId: { group: 14, index: 13, level: 0 },
  },
  jewelOfSoul: {
    label: "Jewel of Soul",
    icon: { group: 14, index: 14 },
    dbField: "JewelOfSoul",
    itemId: { group: 14, index: 14, level: 0 },
  },
  jewelOfLife: {
    label: "Jewel of Life",
    icon: { group: 14, index: 16 },
    dbField: "JewelOfLife",
    itemId: { group: 14, index: 16, level: 0 },
  },
  jewelOfCreation: {
    label: "Jewel of Creation",
    icon: { group: 14, index: 22 },
    dbField: "JewelOfCreation",
    itemId: { group: 14, index: 22, level: 0 },
  },
  jewelOfChaos: {
    label: "Jewel of Chaos",
    icon: { group: 12, index: 15 },
    dbField: "JewelOfChaos",
    itemId: { group: 12, index: 15, level: 0 },
  },
};

export const DEPOSIT_ITEM_TYPES = Object.keys(
  DEPOSITABLE_ITEMS,
) as DepositItemType[];
