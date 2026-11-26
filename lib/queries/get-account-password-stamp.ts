import "server-only";
import { cache } from "react";
import { getAuthSecret } from "@/lib/auth/secret";
import { passwordStamp } from "@/lib/auth/session-stamp";
import { prisma } from "@/prisma/prisma";

/**
 * The stamp of the account's current password (see `passwordStamp`), or null when the account is
 * gone. A session whose stamp differs was made before a password change. Once per request.
 */
export const getAccountPasswordStamp = cache(
  async (accountId: string): Promise<string | null> => {
    const account = await prisma.mEMB_INFO.findUnique({
      where: { memb___id: accountId },
      select: { memb__pwd: true },
    });
    return account ? passwordStamp(account.memb__pwd, getAuthSecret()) : null;
  },
);
