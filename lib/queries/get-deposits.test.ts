import { prisma } from "@/prisma/prisma";
import { getDeposits } from "./get-deposits";

jest.mock("@/prisma/prisma", () => ({
  prisma: {
    warehouse: { findUnique: jest.fn() },
    accountDeposit: { findUnique: jest.fn() },
    mEMB_STAT: { findUnique: jest.fn() },
  },
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  jest.clearAllMocks();
});

test("reads the warehouse, then the balance, then the account status", async () => {
  let releaseWarehouse: (value: unknown) => void = () => {};
  let releaseBalance: (value: unknown) => void = () => {};
  (prisma.warehouse.findUnique as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      releaseWarehouse = resolve;
    }),
  );
  (prisma.accountDeposit.findUnique as jest.Mock).mockReturnValue(
    new Promise((resolve) => {
      releaseBalance = resolve;
    }),
  );
  (prisma.mEMB_STAT.findUnique as jest.Mock).mockResolvedValue({
    ConnectStat: 0,
  });

  const pending = getDeposits("acc");
  await flush();

  expect(prisma.warehouse.findUnique).toHaveBeenCalledTimes(1);
  expect(prisma.accountDeposit.findUnique).not.toHaveBeenCalled();

  releaseWarehouse(null);
  await flush();

  expect(prisma.accountDeposit.findUnique).toHaveBeenCalledTimes(1);
  expect(prisma.mEMB_STAT.findUnique).not.toHaveBeenCalled();

  releaseBalance(null);
  const deposits = await pending;

  expect(deposits.isOffline).toBe(true);
  expect(prisma.mEMB_STAT.findUnique).toHaveBeenCalledTimes(1);
});
