import { requestPasswordResetSchema } from "./request-password-reset";

test("takes a username and an email", () => {
  const result = requestPasswordResetSchema.safeParse({
    username: "Knight",
    email: "knight@example.com",
  });

  expect(result.success).toBe(true);
});

test("refuses a username the game does not allow and an email that is not one", () => {
  const result = requestPasswordResetSchema.safeParse({
    username: "ab",
    email: "not-an-email",
  });

  expect(result.success).toBe(false);
  expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
    "username",
    "email",
  ]);
});

test("refuses an email longer than the account's 50 characters", () => {
  const result = requestPasswordResetSchema.safeParse({
    username: "Knight",
    email: `${"a".repeat(39)}@example.com`,
  });

  expect(result.success).toBe(false);
});
