import type { JWT } from "next-auth/jwt";

/**
 * Auth.js's jwt callback: on sign-in the session keeps the stamp of the account's password; after it,
 * a session whose stamp is no longer the account's (a new password from the reset link or the account
 * page, or the account gone) ends. Sessions made before the stamp existed end too.
 */
export const refreshSessionToken = async (
  token: JWT,
  signedInAccountId: string | undefined,
  getStamp: (accountId: string) => Promise<string | null>,
): Promise<JWT | null> => {
  if (signedInAccountId) {
    return {
      ...token,
      sub: signedInAccountId,
      pws: await getStamp(signedInAccountId),
    };
  }
  if (
    !token.sub ||
    typeof token.pws !== "string" ||
    token.pws !== (await getStamp(token.sub))
  ) {
    return null;
  }
  return token;
};
