/**
 * @jest-environment node
 */
import { encodePassword } from "@/lib/auth/password";
import { createPasswordResetToken } from "@/lib/auth/password-reset-token";
import { prisma } from "@/prisma/prisma";
import { resetPasswordAction } from "./reset-password";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/prisma/prisma", () => ({
  prisma: { mEMB_INFO: { findUnique: jest.fn(), updateMany: jest.fn() } },
}));

const password = Uint8Array.from([1, 2, 3, 4]);
const stored = {
  memb___id: "Knight",
  memb__pwd: password,
  mail_addr: "knight@example.com",
};

const tokenFor = (expires = Math.floor(Date.now() / 1000) + 600) =>
  createPasswordResetToken(
    { username: "Knight", password, email: "knight@example.com" },
    expires,
    "test-secret",
  );

const submit = (token: string, newPassword = "newpass1", confirm?: string) => {
  const form = new FormData();
  form.set("token", token);
  form.set("newPassword", newPassword);
  form.set("confirmPassword", confirm ?? newPassword);
  return resetPasswordAction({}, form);
};

const LINK_NOT_VALID = {
  success: false,
  message:
    "This link has run out or was already used. Ask for a new one on the forgot password page.",
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.AUTH_SECRET = "test-secret";
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue(stored);
  (prisma.mEMB_INFO.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
});

test("sets the new password, only over the password the link was made for", async () => {
  const result = await submit(tokenFor());

  expect(result).toEqual({
    success: true,
    message: "Your password has been changed. You can log in with it now.",
  });
  expect(prisma.mEMB_INFO.updateMany).toHaveBeenCalledWith({
    where: { memb___id: "Knight", memb__pwd: password },
    data: { memb__pwd: encodePassword("Knight", "newpass1") },
  });
});

test("says the link no longer works when another use changed the password at the same time", async () => {
  (prisma.mEMB_INFO.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

  expect(await submit(tokenFor())).toEqual(LINK_NOT_VALID);
});

test("changes nothing with a link that ran out, was used, or is not one", async () => {
  const ranOut = await submit(tokenFor(Math.floor(Date.now() / 1000) - 1));

  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValueOnce({
    ...stored,
    memb__pwd: Uint8Array.from([9, 9, 9, 9]),
  });
  const used = await submit(tokenFor());

  const notOne = await submit("Knight.1.nonsense");

  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValueOnce(null);
  const noAccount = await submit(tokenFor());

  for (const result of [ranOut, used, notOne, noAccount]) {
    expect(result).toEqual(LINK_NOT_VALID);
  }
  expect(prisma.mEMB_INFO.updateMany).not.toHaveBeenCalled();
});

test("returns the field errors and changes nothing for invalid input", async () => {
  const result = await submit(tokenFor(), "newpass1", "newpass2");

  expect(result.success).toBe(false);
  expect(result.errors?.confirmPassword).toEqual(["Passwords do not match."]);
  expect(prisma.mEMB_INFO.findUnique).not.toHaveBeenCalled();
  expect(prisma.mEMB_INFO.updateMany).not.toHaveBeenCalled();
});
