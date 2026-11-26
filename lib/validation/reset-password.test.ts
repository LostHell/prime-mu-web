import { resetPasswordSchema } from "./reset-password";

test("takes a token and a new password typed twice", () => {
  const result = resetPasswordSchema.safeParse({
    token: "Knight.1.abc",
    newPassword: "secret1",
    confirmPassword: "secret1",
  });

  expect(result.success).toBe(true);
});

test("says so when the two passwords differ", () => {
  const result = resetPasswordSchema.safeParse({
    token: "Knight.1.abc",
    newPassword: "secret1",
    confirmPassword: "secret2",
  });

  expect(result.error?.issues[0]).toMatchObject({
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
});

test("refuses a password the game does not allow and an empty token", () => {
  const short = resetPasswordSchema.safeParse({
    token: "Knight.1.abc",
    newPassword: "12345",
    confirmPassword: "12345",
  });
  const long = resetPasswordSchema.safeParse({
    token: "Knight.1.abc",
    newPassword: "12345678901",
    confirmPassword: "12345678901",
  });
  const noToken = resetPasswordSchema.safeParse({
    token: "",
    newPassword: "secret1",
    confirmPassword: "secret1",
  });

  expect(short.success).toBe(false);
  expect(long.success).toBe(false);
  expect(noToken.success).toBe(false);
});
