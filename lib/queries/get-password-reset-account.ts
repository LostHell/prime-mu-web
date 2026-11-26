import "server-only";
import {
  isPasswordResetTokenValid,
  readPasswordResetToken,
} from "@/lib/auth/password-reset-token";
import { getAuthSecret } from "@/lib/auth/secret";
import { prisma } from "@/prisma/prisma";

/** The account a reset link is for, while the link still works; null when it does not. */
export const getPasswordResetAccount = async (
  token: string,
  now = Math.floor(Date.now() / 1000),
): Promise<{ username: string } | null> => {
  const named = readPasswordResetToken(token);
  if (!named || named.expires <= now) {
    return null;
  }

  const account = await prisma.mEMB_INFO.findUnique({
    where: { memb___id: named.username },
    select: { memb___id: true, memb__pwd: true, mail_addr: true },
  });
  if (
    !account?.mail_addr ||
    !isPasswordResetTokenValid(
      token,
      {
        username: account.memb___id,
        password: account.memb__pwd,
        email: account.mail_addr,
      },
      now,
      getAuthSecret(),
    )
  ) {
    return null;
  }
  return { username: account.memb___id };
};
