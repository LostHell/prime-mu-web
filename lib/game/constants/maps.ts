import { serverConfig } from "@/lib/game/server-config";

/** Map names by map number, synced from the game server's MapManager.txt. */
export const MAP_NAME_BY_ID: Record<number, string> = serverConfig.maps;
