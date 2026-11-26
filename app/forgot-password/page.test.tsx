import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ForgotPasswordPage from "./page";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));
jest.mock("./_components/forgot-password-form", () => ({
  ForgotPasswordForm: () => null,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("sends a signed-in player to the user panel", async () => {
  (auth as jest.Mock).mockResolvedValue({ user: { id: "Knight" } });

  await expect(ForgotPasswordPage()).rejects.toThrow("NEXT_REDIRECT");
  expect(redirect).toHaveBeenCalledWith("/user-panel");
});

test("shows the form to a signed-out visitor", async () => {
  (auth as jest.Mock).mockResolvedValue(null);

  await ForgotPasswordPage();

  expect(redirect).not.toHaveBeenCalled();
});
