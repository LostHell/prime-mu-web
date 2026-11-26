import { createHmac } from "node:crypto";

/**
 * A short fingerprint of the account's stored password, kept in the session (not the password bytes
 * themselves): a new password gives a new stamp, and the sessions with the old one end.
 */
export const passwordStamp = (password: Uint8Array, secret: string) =>
  createHmac("sha256", secret)
    .update("session\n")
    .update(password)
    .digest("base64url")
    .slice(0, 22);
