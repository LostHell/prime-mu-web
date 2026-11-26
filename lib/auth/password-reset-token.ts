import { createHmac, timingSafeEqual } from "node:crypto";

/** The account as the database has it when the link is made and when it is used. */
export type PasswordResetAccount = {
  username: string;
  /** `MEMB_INFO.memb__pwd`, the stored password bytes. */
  password: Uint8Array;
  email: string;
};

// <username>.<expiry in unix seconds>.<HMAC-SHA256, base64url>
const TOKEN_PATTERN = /^([a-zA-Z0-9]{4,10})\.(\d{1,12})\.([A-Za-z0-9_-]{43})$/;

const signature = (
  account: PasswordResetAccount,
  expires: number,
  secret: string,
) =>
  createHmac("sha256", secret)
    .update(
      [
        "password-reset",
        account.username,
        String(expires),
        Buffer.from(account.password).toString("hex"),
        account.email.trim().toLowerCase(),
      ].join("\n"),
    )
    .digest("base64url");

/**
 * A reset link's token, kept nowhere: it is signed over the account's stored password and email, so
 * it stops working once the password (or the email) changes, which makes it good for one use.
 */
export const createPasswordResetToken = (
  account: PasswordResetAccount,
  expires: number,
  secret: string,
) => `${account.username}.${expires}.${signature(account, expires, secret)}`;

/** The account a token names, read without checking it; null when it is not a token at all. */
export const readPasswordResetToken = (token: string) => {
  const match = TOKEN_PATTERN.exec(token);
  return match ? { username: match[1], expires: Number(match[2]) } : null;
};

/** The token was made for this account as it is now, and has not run out at `now` (unix seconds). */
export const isPasswordResetTokenValid = (
  token: string,
  account: PasswordResetAccount,
  now: number,
  secret: string,
) => {
  const match = TOKEN_PATTERN.exec(token);
  if (!match || match[1] !== account.username) {
    return false;
  }
  const expires = Number(match[2]);
  if (expires <= now) {
    return false;
  }
  const expected = Buffer.from(signature(account, expires, secret));
  const given = Buffer.from(match[3]);
  return expected.length === given.length && timingSafeEqual(expected, given);
};
