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
  defense?: number;
  defRate?: number;
  dmgMin?: number;
  dmgMax?: number;
  classFlags?: ItemClassFlags;
};

export type ItemDatabase = Map<string, ItemDefinition>;