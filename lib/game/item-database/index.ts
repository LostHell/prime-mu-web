import { getItemDatabase, getItemKey } from "./database";
import { type ItemDefinition } from "./types";

export const getItemDefinition = (
  group: number,
  index: number,
): ItemDefinition | undefined => {
  const database = getItemDatabase();
  return database.get(getItemKey(group, index));
}
