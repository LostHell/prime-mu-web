/**
 * @jest-environment node
 */
import {
  createPasswordResetToken,
  isPasswordResetTokenValid,
  readPasswordResetToken,
} from "./password-reset-token";

const SECRET = "test-secret";
const NOW = 1_800_000_000;

const account = {
  username: "Knight",
  password: Uint8Array.from([1, 2, 3, 4]),
  email: "knight@example.com",
};

const tokenFor = (expires = NOW + 60) =>
  createPasswordResetToken(account, expires, SECRET);

test("accepts its own token before it runs out", () => {
  expect(isPasswordResetTokenValid(tokenFor(), account, NOW, SECRET)).toBe(
    true,
  );
});

test("refuses a token once it has run out", () => {
  const token = tokenFor(NOW + 60);

  expect(isPasswordResetTokenValid(token, account, NOW + 60, SECRET)).toBe(
    false,
  );
});

test("refuses a token once the password has changed, so a link works only once", () => {
  const changed = { ...account, password: Uint8Array.from([9, 9, 9, 9]) };

  expect(isPasswordResetTokenValid(tokenFor(), changed, NOW, SECRET)).toBe(
    false,
  );
});

test("refuses a token once the account's email has changed, whatever its case", () => {
  const moved = { ...account, email: "other@example.com" };
  const recased = { ...account, email: " KNIGHT@example.com " };

  expect(isPasswordResetTokenValid(tokenFor(), moved, NOW, SECRET)).toBe(false);
  expect(isPasswordResetTokenValid(tokenFor(), recased, NOW, SECRET)).toBe(
    true,
  );
});

test("refuses a token made for another account or with another secret", () => {
  const other = { ...account, username: "Archer" };
  const forged = createPasswordResetToken(account, NOW + 60, "other-secret");

  expect(isPasswordResetTokenValid(tokenFor(), other, NOW, SECRET)).toBe(false);
  expect(isPasswordResetTokenValid(forged, account, NOW, SECRET)).toBe(false);
});

test("refuses a token whose expiry was moved", () => {
  const [username, , signed] = tokenFor(NOW + 60).split(".");
  const later = `${username}.${NOW + 3600}.${signed}`;

  expect(isPasswordResetTokenValid(later, account, NOW, SECRET)).toBe(false);
});

test("reads the account and expiry of a token, and nothing from text that is not one", () => {
  expect(readPasswordResetToken(tokenFor(NOW + 60))).toEqual({
    username: "Knight",
    expires: NOW + 60,
  });
  expect(readPasswordResetToken("")).toBeNull();
  expect(readPasswordResetToken("Knight.123")).toBeNull();
  expect(readPasswordResetToken("a b.1.x")).toBeNull();
  expect(isPasswordResetTokenValid("nonsense", account, NOW, SECRET)).toBe(
    false,
  );
});
