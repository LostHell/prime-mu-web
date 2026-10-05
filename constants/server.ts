import { serverConfig } from "@/lib/game/server-config";

/** Public server settings, synced from the game server (lib/game/server-config.ts). */
export const VERSION = "0.97d";
export const MAX_ONLINE = serverConfig.server.maxOnline;
export const MAX_LEVEL = serverConfig.character.maxLevel;
export const DROP_RATE = `${serverConfig.server.itemDropRate}%`;
export const EXPERIENCE_RATE = `${serverConfig.server.experienceRate}x`;
/** IANA timezone used by all event schedules; configure before publishing event times. */
export const SERVER_TIME_ZONE = process.env.NEXT_PUBLIC_GAME_TIME_ZONE ?? "UTC";
