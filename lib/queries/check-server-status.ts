import net from "node:net";

const CACHE_DURATION = 5000;
const GAME_SERVER_PORT = Number(process.env.GAME_SERVER_PORT ?? 55901);
const GAME_SERVER_HOST = process.env.GAME_SERVER_HOST ?? "127.0.0.1";

type CachedStatus = {
  status: "online" | "offline";
  lastCheck: number;
};

let cachedStatus: CachedStatus | null = null;

export async function checkServerStatus(): Promise<CachedStatus> {
  const now = Date.now();

  if (cachedStatus && now - cachedStatus.lastCheck < CACHE_DURATION) {
    return cachedStatus;
  }

  const status = await new Promise<"online" | "offline">((resolve) => {
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

  cachedStatus = { status, lastCheck: now };
  return cachedStatus;
}
