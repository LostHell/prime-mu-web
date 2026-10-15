import "server-only";

import { MAX_RESETS, POINTS_PER_RESET } from "@/constants/resets";
import {
  DROP_RATE,
  EXPERIENCE_RATE,
  MAX_LEVEL,
  MAX_ONLINE,
  VERSION,
} from "@/constants/server";
import { ServerInfo } from "@/lib/types/server-info";
import { cacheFor } from "@/lib/utils/cache-for";
import { getServerPopulation } from "@/prisma/generated/prisma/sql";
import { prisma } from "@/prisma/prisma";
import { cache } from "react";
import { getServerStatus } from "./get-server-status";

const POPULATION_CACHE_MS = 30_000;

type Population = {
  online: number;
  registered: number;
  guilds: number;
};

// One statement holds one pool connection. The filtered MEMB_STAT count waits
// on the game server's table lock, so overlapping pages share that read and
// then reuse it instead of checking out a connection each.
const loadPopulation = cacheFor(
  POPULATION_CACHE_MS,
  async (): Promise<Population> => {
    const [result] = await prisma.$queryRawTyped(getServerPopulation());

    return {
      online: Number(result?.online ?? 0),
      registered: Number(result?.registered ?? 0),
      guilds: Number(result?.guilds ?? 0),
    };
  },
);

export const getServerInfo = cache(async (): Promise<ServerInfo> => {
  const [population, statusResult] = await Promise.all([
    loadPopulation(),
    getServerStatus(),
  ]);

  return {
    version: VERSION,
    experience: EXPERIENCE_RATE,
    drop: DROP_RATE,
    maxLevel: MAX_LEVEL,
    maxResets: MAX_RESETS,
    points: `${POINTS_PER_RESET}/reset`,
    online: population.online,
    maxOnline: MAX_ONLINE,
    registered: population.registered,
    guilds: population.guilds,
    status: statusResult.status,
  };
});
