/**
 * @jest-environment node
 */
import { passwordStamp } from "@/lib/auth/session-stamp";
import { prisma } from "@/prisma/prisma";
import { getAccountPasswordStamp } from "./get-account-password-stamp";

jest.mock("@/prisma/prisma", () => ({
  prisma: { mEMB_INFO: { findUnique: jest.fn() } },
}));

beforeEach(() => {
  jest.clearAllMocks();
  process.env.AUTH_SECRET = "test-secret";
});

test("gives the stamp of the account's stored password", async () => {
  const password = Uint8Array.from([1, 2, 3, 4]);
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue({
    memb__pwd: password,
  });

  expect(await getAccountPasswordStamp("Knight")).toBe(
    passwordStamp(password, "test-secret"),
  );
  expect(prisma.mEMB_INFO.findUnique).toHaveBeenCalledWith({
    where: { memb___id: "Knight" },
    select: { memb__pwd: true },
  });
});

test("has no stamp for an account that is gone", async () => {
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue(null);

  expect(await getAccountPasswordStamp("Gone")).toBeNull();
});
