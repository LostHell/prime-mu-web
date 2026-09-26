import { ItemDefinition } from "../game/item-database/types";
import { DecodedItem } from "../game/item-decoder/types";

export type WarehouseItem = DecodedItem &
  Pick<
    ItemDefinition,
    | "defense"
    | "defRate"
    | "dmgMin"
    | "dmgMax"
    | "reqStr"
    | "reqAgi"
    | "classFlags"
  > & {
    name: string;
    width: number;
    height: number;
  };
