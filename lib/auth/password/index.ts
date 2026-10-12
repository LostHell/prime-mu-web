import { timingSafeEqual } from "node:crypto";
import { serverConfig } from "@/lib/game/server-config";
import { encodePasswordBytes } from "./modes";

/** The memb__pwd value for a password, in the server's encryption mode. */
export const encodePassword = (
  account: string,
  password: string,
): Uint8Array<ArrayBuffer> =>
  new Uint8Array(
    encodePasswordBytes(serverConfig.account.md5Encryption, account, password),
  );

/** Whether the typed password matches the account's stored password, in constant time. */
export const verifyPassword = ({
  password,
  account,
}: {
  password: string;
  account: { username: string; password: Uint8Array };
}): boolean => {
  const expected = encodePassword(account.username, password);
  return (
    account.password.length === expected.length &&
    timingSafeEqual(account.password, expected)
  );
};
