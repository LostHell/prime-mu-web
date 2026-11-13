import "server-only";

import { BRAND } from "@/constants/app";
import type { LauncherStatus } from "@/lib/types/launcher";
import { getServerInfo } from "./get-server-info";

/** The game server and its players, for the launcher. Offline, it counts nobody (MEMB_STAT can lag behind). */
export const getLauncherStatus = async (): Promise<LauncherStatus> => {
  const info = await getServerInfo();
  const online = info.status === "online";
  const players = online ? info.online : 0;

  return {
    online: players,
    max: info.maxOnline,
    servers: [{ name: BRAND, online, players }],
  };
};
