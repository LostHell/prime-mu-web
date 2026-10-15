import "server-only";

import { cacheFor } from "@/lib/utils/cache-for";
import net from "node:net";

const CACHE_DURATION = 5000;
const GAME_SERVER_PORT = Number(process.env.GAME_SERVER_PORT ?? 55901);
const GAME_SERVER_HOST = process.env.GAME_SERVER_HOST ?? "127.0.0.1";

type CachedStatus = {
  status: "online" | "offline";
  lastCheck: number;
};

async function probeServer(): Promise<"online" | "offline"> {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const finish = (value: "online" | "offline") => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(2000);
    socket.once("connect", () => finish("online"));
    socket.once("timeout", () => finish("offline"));
    socket.once("error", () => finish("offline"));
    socket.connect(GAME_SERVER_PORT, GAME_SERVER_HOST);
  });
}

export const getServerStatus = cacheFor(
  CACHE_DURATION,
  async (): Promise<CachedStatus> => ({
    status: await probeServer(),
    lastCheck: Date.now(),
  }),
);
