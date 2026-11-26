import { act, render, screen } from "@testing-library/react";
import { PASSWORD_RESET_EMAIL_INTERVAL_MINUTES } from "@/constants/password-reset";
import { click, type } from "@/lib/test-utils/interactions";
import { requestPasswordResetAction } from "@/lib/actions/request-password-reset";
import { ForgotPasswordForm } from "./forgot-password-form";

jest.mock("@/lib/actions/request-password-reset", () => ({
  requestPasswordResetAction: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

test("sends the username and email and shows the answer", async () => {
  jest.mocked(requestPasswordResetAction).mockResolvedValue({
    success: true,
    message: "If the username and email match an account, we sent it a link.",
  });
  render(<ForgotPasswordForm />);

  await type(screen.getByLabelText("Username"), "Knight");
  await type(screen.getByLabelText("Email"), "knight@example.com");
  await click(screen.getByRole("button", { name: "Send reset link" }));

  expect(
    await screen.findByText(
      "If the username and email match an account, we sent it a link.",
    ),
  ).toBeInTheDocument();
  const form = jest.mocked(requestPasswordResetAction).mock.calls[0][1];
  expect(form.get("username")).toBe("Knight");
  expect(form.get("email")).toBe("knight@example.com");
});

test("shows the field errors", async () => {
  jest.mocked(requestPasswordResetAction).mockResolvedValue({
    success: false,
    message: "Please correct the errors and try again.",
    errors: { email: ["Please provide a valid email address."] },
  });
  render(<ForgotPasswordForm />);

  await click(screen.getByRole("button", { name: "Send reset link" }));

  expect(
    await screen.findByText("Please provide a valid email address."),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Please correct the errors and try again."),
  ).toBeInTheDocument();
});

test("locks the button for the email interval after a link is sent, then frees it", async () => {
  // Fake timers that still move with real time, so the user events keep working.
  jest.useFakeTimers({ advanceTimers: true });
  jest.mocked(requestPasswordResetAction).mockResolvedValue({
    success: true,
    message: "Sent.",
  });
  render(<ForgotPasswordForm />);

  await click(screen.getByRole("button", { name: "Send reset link" }));

  const locked = await screen.findByRole("button", {
    name: `Send again in ${PASSWORD_RESET_EMAIL_INTERVAL_MINUTES}:00`,
  });
  expect(locked).toBeDisabled();

  act(() => {
    jest.advanceTimersByTime(60 * 1000);
  });
  expect(
    screen.getByRole("button", {
      name: `Send again in ${PASSWORD_RESET_EMAIL_INTERVAL_MINUTES - 1}:00`,
    }),
  ).toBeDisabled();

  act(() => {
    jest.advanceTimersByTime(PASSWORD_RESET_EMAIL_INTERVAL_MINUTES * 60 * 1000);
  });
  expect(screen.getByRole("button", { name: "Send reset link" })).toBeEnabled();
});

test("keeps the button free after an error", async () => {
  jest.mocked(requestPasswordResetAction).mockResolvedValue({
    success: false,
    message: "Too many requests. Please try again later.",
  });
  render(<ForgotPasswordForm />);

  await click(screen.getByRole("button", { name: "Send reset link" }));

  expect(
    await screen.findByText("Too many requests. Please try again later."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Send reset link" })).toBeEnabled();
});
