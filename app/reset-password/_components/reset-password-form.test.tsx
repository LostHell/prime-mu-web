import { render, screen } from "@testing-library/react";
import { click, type } from "@/lib/test-utils/interactions";
import { resetPasswordAction } from "@/lib/actions/reset-password";
import { ResetPasswordForm } from "./reset-password-form";

jest.mock("@/lib/actions/reset-password", () => ({
  resetPasswordAction: jest.fn(),
}));

const fillAndSubmit = async () => {
  await type(screen.getByLabelText("New Password"), "newpass1");
  await type(screen.getByLabelText("Confirm New Password"), "newpass1");
  await click(screen.getByRole("button", { name: "Set new password" }));
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("sends the link's token with the new password, then offers the login", async () => {
  jest.mocked(resetPasswordAction).mockResolvedValue({
    success: true,
    message: "Your password has been changed. You can log in with it now.",
  });
  render(<ResetPasswordForm token="Knight.1.abc" />);

  await fillAndSubmit();

  expect(
    await screen.findByText(
      "Your password has been changed. You can log in with it now.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
    "href",
    "/login",
  );
  expect(screen.queryByLabelText("New Password")).not.toBeInTheDocument();
  const form = jest.mocked(resetPasswordAction).mock.calls[0][1];
  expect(form.get("token")).toBe("Knight.1.abc");
  expect(form.get("newPassword")).toBe("newpass1");
  expect(form.get("confirmPassword")).toBe("newpass1");
});

test("keeps the form and shows why when the password was not set", async () => {
  jest.mocked(resetPasswordAction).mockResolvedValue({
    success: false,
    message:
      "This link has run out or was already used. Ask for a new one on the forgot password page.",
  });
  render(<ResetPasswordForm token="Knight.1.abc" />);

  await fillAndSubmit();

  expect(
    await screen.findByText(
      "This link has run out or was already used. Ask for a new one on the forgot password page.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByLabelText("New Password")).toBeInTheDocument();
});
