const BOX_OF_LUCK = { group: 14, index: 11, level: 0 };

export const BOX_OF_LUCK_ITEM_LEVEL_MAP: Record<number, { name: string }> = {
  [0]: {
    name: "Box of Luck",
  },
  [1]: {
    name: "Start of Sacred Birth",
  },
  [2]: {
    name: "Firecracker",
  },
  [3]: {
    name: "Heart of Love",
  },
  [5]: {
    name: "Silver Medal",
  },
  [6]: {
    name: "Gold Medal",
  },
  [7]: {
    name: "Box of Heaven",
  },
  [8]: {
    name: "Box of Kundun +1",
  },
  [9]: {
    name: "Box of Kundun +2",
  },
  [10]: {
    name: "Box of Kundun +3",
  },
  [11]: {
    name: "Box of Kundun +4",
  },
  [12]: {
    name: "Box of Kundun +5",
  },
};

export const isBoxOfLuckItem = (group: number, index: number): boolean => {
  return group === BOX_OF_LUCK.group && index === BOX_OF_LUCK.index;
};
