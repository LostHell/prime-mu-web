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

export type ItemClassFlags = {
  dw: number;
  dk: number;
  elf: number;
  mg: number;
};

export type ItemDefinition = {
  name: string;
  width: number;
  height: number;
  durability?: number;
  reqLevel?: number;
  reqStr?: number;
  reqAgi?: number;
  // Armor / Shield
  defense?: number;
  defRate?: number;
  // Weapon
  dmgMin?: number;
  dmgMax?: number;
  // Class restriction
  classFlags?: ItemClassFlags;
};

export type CurrencyType = "zen" | "credits";
