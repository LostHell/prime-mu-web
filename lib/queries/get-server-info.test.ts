import { prisma } from "@/prisma/prisma";
import { getServerPopulation } from "@/prisma/generated/prisma/sql";
import { getServerInfo } from "./get-server-info";
import { getServerStatus } from "./get-server-status";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    $queryRawTyped: jest.fn(),
  },
}));

jest.mock("@/prisma/generated/prisma/sql", () => ({
  getServerPopulation: jest.fn(() => ({ query: "server-population" })),
}));

jest.mock("./get-server-status", () => ({
  getServerStatus: jest.fn(),
}));

const populationRow = {
  online: 4n,
  registered: 10n,
  guilds: 2n,
};

let now = 0;

beforeEach(() => {
  jest.clearAllMocks();
  now += 60_000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue([populationRow]);
  (getServerStatus as jest.Mock).mockResolvedValue({
    status: "online",
    lastCheck: now,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("reads the population counts with the typed query", async () => {
  const info = await getServerInfo();

  expect(info).toMatchObject({
    online: 4,
    registered: 10,
    guilds: 2,
    status: "online",
  });
  expect(getServerPopulation).toHaveBeenCalledWith();
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
  expect(prisma.$queryRawTyped).toHaveBeenCalledWith({
    query: "server-population",
  });
});

test("shows zero when a population count is missing", async () => {
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue([
    { online: null, registered: 10n, guilds: null },
  ]);

  const info = await getServerInfo();

  expect(info).toMatchObject({ online: 0, registered: 10, guilds: 0 });
});

test("reuses the population until it is thirty seconds old", async () => {
  await getServerInfo();
  jest.spyOn(Date, "now").mockReturnValue(now + 29_999);

  const info = await getServerInfo();

  expect(info.online).toBe(4);
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("reads the population again once it is thirty seconds old", async () => {
  await getServerInfo();
  jest.spyOn(Date, "now").mockReturnValue(now + 30_000);
  (prisma.$queryRawTyped as jest.Mock).mockResolvedValue([
    { online: 7n, registered: 11n, guilds: 3n },
  ]);

  const info = await getServerInfo();

  expect(info).toMatchObject({ online: 7, registered: 11, guilds: 3 });
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(2);
});

test("shares one population read across overlapping callers", async () => {
  let resolveRows: (rows: (typeof populationRow)[]) => void = () => {};
  (prisma.$queryRawTyped as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      resolveRows = resolve;
    }),
  );

  const first = getServerInfo();
  const second = getServerInfo();
  resolveRows([populationRow]);
  const [left, right] = await Promise.all([first, second]);

  expect(left.online).toBe(4);
  expect(right.registered).toBe(10);
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(1);
});

test("tries the population again after a read fails", async () => {
  (prisma.$queryRawTyped as jest.Mock).mockRejectedValueOnce(
    new Error("db down"),
  );

  await expect(getServerInfo()).rejects.toThrow("db down");

  const info = await getServerInfo();

  expect(info.guilds).toBe(2);
  expect(prisma.$queryRawTyped).toHaveBeenCalledTimes(2);
});
