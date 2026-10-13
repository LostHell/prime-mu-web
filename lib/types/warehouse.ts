import { type ItemDefinition } from "@/lib/game/item-database/types";
import { type DecodedItem } from "@/lib/game/item-decoder/types";

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
