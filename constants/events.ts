import { serverConfig } from "@/lib/game/server-config";

// Daily event start hours in SERVER_TIME_ZONE (constants/server.ts), synced
// from the game server's BloodCastle.dat and DevilSquare.dat.
export const eventSchedules = serverConfig.events;
