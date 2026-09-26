/** Public server settings. Keep these in sync with the game-server configuration. */
export const VERSION = "0.97d";
export const MAX_ONLINE = 120;
/** Distinct from reset eligibility; seeded characters reach level 400. */
export const MAX_LEVEL = 400;
export const DROP_RATE = "40%";
export const EXPERIENCE_RATE = "30x";
/** IANA timezone used by all event schedules; configure before publishing event times. */
export const SERVER_TIME_ZONE = process.env.NEXT_PUBLIC_GAME_TIME_ZONE ?? "UTC";
