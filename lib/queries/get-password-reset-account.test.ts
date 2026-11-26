/**
 * @jest-environment node
 */
import { createPasswordResetToken } from "@/lib/auth/password-reset-token";
import { prisma } from "@/prisma/prisma";
import { getPasswordResetAccount } from "./get-password-reset-account";

jest.mock("@/prisma/prisma", () => ({
  prisma: { mEMB_INFO: { findUnique: jest.fn() } },
}));

const NOW = 1_800_000_000;
const password = Uint8Array.from([1, 2, 3, 4]);
const stored = {
  memb___id: "Knight",
  memb__pwd: password,
  mail_addr: "knight@example.com",
};
const token = createPasswordResetToken(
  { username: "Knight", password, email: "knight@example.com" },
  NOW + 60,
  "test-secret",
);

beforeEach(() => {
  jest.clearAllMocks();
  process.env.AUTH_SECRET = "test-secret";
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue(stored);
});

test("names the account of a link that still works", async () => {
  expect(await getPasswordResetAccount(token, NOW)).toEqual({
    username: "Knight",
  });
  expect(prisma.mEMB_INFO.findUnique).toHaveBeenCalledWith({
    where: { memb___id: "Knight" },
    select: { memb___id: true, memb__pwd: true, mail_addr: true },
  });
});

test("reads nothing for a link that ran out or is not one", async () => {
  expect(await getPasswordResetAccount(token, NOW + 60)).toBeNull();
  expect(await getPasswordResetAccount("nonsense", NOW)).toBeNull();
  expect(prisma.mEMB_INFO.findUnique).not.toHaveBeenCalled();
});

test("has no account once the password changed, the email is gone or the account is gone", async () => {
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValueOnce({
    ...stored,
    memb__pwd: Uint8Array.from([9, 9, 9, 9]),
  });
  expect(await getPasswordResetAccount(token, NOW)).toBeNull();

  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValueOnce({
    ...stored,
    mail_addr: null,
  });
  expect(await getPasswordResetAccount(token, NOW)).toBeNull();

  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValueOnce(null);
  expect(await getPasswordResetAccount(token, NOW)).toBeNull();
});
