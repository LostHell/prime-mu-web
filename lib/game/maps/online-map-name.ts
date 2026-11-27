import { MAP_NAME_BY_ID } from "@/lib/game/constants/maps";

const EVENT_MAPS = [
  { prefix: "Blood Castle", short: "BC" },
  { prefix: "Devil Square", short: "DS" },
] as const;

/**
 * A map's name for the online list: the synced name, the events' arenas as BC and DS without their
 * level. Undefined for a map the server config does not name.
 */
export const onlineMapName = (
  mapNumber: number | null | undefined,
): string | undefined => {
  if (mapNumber == null) return undefined;
  const name = MAP_NAME_BY_ID[mapNumber];
  if (name === undefined) return undefined;
  return (
    EVENT_MAPS.find((event) => name.startsWith(event.prefix))?.short ?? name
  );
};
