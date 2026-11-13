import { getLauncherStatus } from "./get-launcher-status";
import { getServerInfo } from "./get-server-info";

jest.mock("./get-server-info", () => ({
  getServerInfo: jest.fn(),
}));

const info = (status: "online" | "offline", online: number) => ({
  version: "0.97d",
  experience: "100x",
  drop: "50%",
  maxLevel: 400,
  maxResets: 50,
  points: "500/reset",
  online,
  maxOnline: 500,
  registered: 1000,
  guilds: 12,
  status,
});

test("lists the server with its players while it is online", async () => {
  (getServerInfo as jest.Mock).mockResolvedValue(info("online", 142));

  expect(await getLauncherStatus()).toEqual({
    online: 142,
    max: 500,
    servers: [{ name: "Prime Mu", online: true, players: 142 }],
  });
});

test("counts nobody while the server is offline, whatever MEMB_STAT still says", async () => {
  (getServerInfo as jest.Mock).mockResolvedValue(info("offline", 3));

  expect(await getLauncherStatus()).toEqual({
    online: 0,
    max: 500,
    servers: [{ name: "Prime Mu", online: false, players: 0 }],
  });
});
