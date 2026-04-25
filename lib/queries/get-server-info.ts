import {
  DROP_RATE,
  EXPERIENCE_RATE,
  MAX_ONLINE,
  MAX_RESETS,
  MIN_RESET_LEVEL,
  POINTS_PER_RESET,
  VERSION,
} from "@/constants/resets";
import { ServerInfo } from "@/lib/types/server-info";
import { prisma } from "@/prisma/prisma";
import { checkServerStatus } from "./check-server-status";

export async function getServerInfo(): Promise<ServerInfo> {
  const [online, registered, guilds, statusResult] = await Promise.all([
    prisma.mEMB_STAT.count({ where: { ConnectStat: { not: 0 } } }),
    prisma.mEMB_INFO.count(),
    prisma.guild.count(),
    checkServerStatus(),
  ]);

  return {
    version: VERSION,
    experience: EXPERIENCE_RATE,
    drop: DROP_RATE,
    maxLevel: MIN_RESET_LEVEL,
    maxResets: MAX_RESETS,
    points: `${POINTS_PER_RESET}/reset`,
    online,
    maxOnline: MAX_ONLINE,
    registered,
    guilds,
    status: statusResult.status,
  };
}
