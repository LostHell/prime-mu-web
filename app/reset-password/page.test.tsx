import { auth } from "@/auth";
import { getPasswordResetAccount } from "@/lib/queries/get-password-reset-account";
import { redirect } from "next/navigation";
import ResetPasswordPage from "./page";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));
jest.mock("@/lib/queries/get-password-reset-account", () => ({
  getPasswordResetAccount: jest.fn(),
}));
jest.mock("./_components/reset-password-form", () => ({
  ResetPasswordForm: () => null,
}));

const open = () =>
  ResetPasswordPage({ searchParams: Promise.resolve({ token: "abc" }) });

beforeEach(() => {
  jest.clearAllMocks();
  (getPasswordResetAccount as jest.Mock).mockResolvedValue({
    username: "Knight",
  });
});

test("sends a signed-in player to the user panel, without reading the link", async () => {
  (auth as jest.Mock).mockResolvedValue({ user: { id: "Knight" } });

  await expect(open()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/user-panel");
  expect(getPasswordResetAccount).not.toHaveBeenCalled();
});

test("checks the link for a signed-out visitor", async () => {
  (auth as jest.Mock).mockResolvedValue(null);

  await open();

  expect(redirect).not.toHaveBeenCalled();
  expect(getPasswordResetAccount).toHaveBeenCalledWith("abc");
});
