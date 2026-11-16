import { BRAND, CLIENT_FPS } from "@/constants/app";
import { serverConfig } from "@/lib/game/server-config";

/** Public server settings, synced from the game server (lib/game/server-config.ts). */
export const VERSION = "0.97d";
export const MAX_ONLINE = serverConfig.server.maxOnline;
export const MAX_LEVEL = serverConfig.character.maxLevel;
export const MAX_STAT_POINT = serverConfig.character.maxStatPoint;
export const DROP_RATE = `${serverConfig.server.itemDropRate}%`;
export const EXPERIENCE_RATE = `${serverConfig.server.experienceRate}x`;

/** One-sentence summary of the server: the site's meta description, its structured data and /llms.txt. */
export const SITE_DESCRIPTION = `${BRAND} is a MU Online ${VERSION} private server with ${EXPERIENCE_RATE} experience and ${DROP_RATE} drop. Windows and macOS. ${CLIENT_FPS}+ FPS.`;
/** IANA timezone used by all event schedules; configure before publishing event times. */
export const SERVER_TIME_ZONE = process.env.NEXT_PUBLIC_GAME_TIME_ZONE ?? "UTC";
