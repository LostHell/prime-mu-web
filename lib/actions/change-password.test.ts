/**
 * @jest-environment node
 */
import { signIn } from "@/auth";
import { encodePassword } from "@/lib/auth/password";
import { prisma } from "@/prisma/prisma";
import { changePasswordAction } from "./change-password";
import { getAuthenticatedUser } from "./utils";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/auth", () => ({ signIn: jest.fn() }));
jest.mock("./utils", () => ({ getAuthenticatedUser: jest.fn() }));
jest.mock("@/prisma/prisma", () => ({
  prisma: { mEMB_INFO: { findUnique: jest.fn(), update: jest.fn() } },
}));

const submit = (
  currentPassword: string,
  newPassword = "newpass1",
  confirmPassword = newPassword,
) => {
  const form = new FormData();
  form.set("currentPassword", currentPassword);
  form.set("newPassword", newPassword);
  form.set("confirmPassword", confirmPassword);
  return changePasswordAction({}, form);
};

beforeEach(() => {
  jest.clearAllMocks();
  (getAuthenticatedUser as jest.Mock).mockResolvedValue("Knight");
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue({
    memb___id: "Knight",
    memb__pwd: encodePassword("Knight", "oldpass1"),
  });
});

test("sets the new password and signs this browser in again with it", async () => {
  const result = await submit("oldpass1");

  expect(result).toEqual({
    success: true,
    message: "Password changed successfully.",
  });
  expect(prisma.mEMB_INFO.update).toHaveBeenCalledWith({
    where: { memb___id: "Knight" },
    data: { memb__pwd: encodePassword("Knight", "newpass1") },
  });
  expect(signIn).toHaveBeenCalledWith("credentials", {
    username: "Knight",
    password: "newpass1",
    redirect: false,
  });
});

test("changes nothing when the current password is wrong", async () => {
  const result = await submit("wrongpass");

  expect(result).toEqual({
    success: false,
    message: "Current password is incorrect.",
  });
  expect(prisma.mEMB_INFO.update).not.toHaveBeenCalled();
  expect(signIn).not.toHaveBeenCalled();
});

test("changes nothing when not logged in or for invalid input", async () => {
  (getAuthenticatedUser as jest.Mock).mockResolvedValueOnce(null);
  const loggedOut = await submit("oldpass1");
  const mismatch = await submit("oldpass1", "newpass1", "newpass2");

  expect(loggedOut).toEqual({
    success: false,
    message: "You must be logged in.",
  });
  expect(mismatch.success).toBe(false);
  expect(mismatch.errors?.confirmPassword).toBeDefined();
  expect(prisma.mEMB_INFO.update).not.toHaveBeenCalled();
});
