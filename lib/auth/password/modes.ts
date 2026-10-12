import { createHash } from "node:crypto";
import { makeAccountKey } from "./account-key";
import { webzenDigest } from "./webzen-md5";

/**
 * JoinServer.ini MD5Encryption, synced as serverConfig.account.md5Encryption.
 * The running server picks one of these. Callers do not.
 */
export const PASSWORD_ENCRYPTION = {
  /** The password bytes themselves. */
  none: 0,
  /** MD5 started from an initial state picked by the account name. */
  webzen: 1,
  /** Standard MD5. */
  default: 2,
} as const;

/** memb__pwd bytes for one JoinServer encryption mode. */
export const encodePasswordBytes = (
  mode: number,
  account: string,
  password: string,
): Buffer => {
  const input = Buffer.from(password, "utf8");
  switch (mode) {
    case PASSWORD_ENCRYPTION.none:
      return input;
    case PASSWORD_ENCRYPTION.webzen:
      return webzenDigest(input, makeAccountKey(account));
    case PASSWORD_ENCRYPTION.default:
      return createHash("md5").update(input).digest();
    default:
      throw new Error(`Unsupported MD5Encryption mode: ${mode}`);
  }
};
