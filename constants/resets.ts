import { serverConfig } from "@/lib/game/server-config";

const { limit, table } = serverConfig.reset;

export const MAX_RESETS = limit;

/** Level and points of the first reset, for the public server overview. */
export const MIN_RESET_LEVEL = table[0].level;
export const POINTS_PER_RESET = table[0].points;
