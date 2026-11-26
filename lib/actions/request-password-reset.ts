"use server";

import { flattenError } from "zod";
import { headers } from "next/headers";
import { after } from "next/server";
import {
  PASSWORD_RESET_EMAIL_INTERVAL_MINUTES,
  PASSWORD_RESET_LINK_MINUTES,
  PASSWORD_RESET_REQUESTS_PER_HOUR,
  PASSWORD_RESET_SENT_MESSAGE,
} from "@/constants/password-reset";
import { createPasswordResetToken } from "@/lib/auth/password-reset-token";
import { getAuthSecret } from "@/lib/auth/secret";
import { passwordResetEmail } from "@/lib/mail/password-reset-email";
import { sendMail } from "@/lib/mail/send-mail";
import { ActionState } from "@/lib/types/action-state";
import { getClientAddress } from "@/lib/utils/client-address";
import { createRateLimiter } from "@/lib/utils/rate-limit";
import { getAbsoluteUrl } from "@/lib/utils/site-url";
import { requestPasswordResetSchema } from "@/lib/validation/request-password-reset";
import { prisma } from "@/prisma/prisma";

const MINUTE_MS = 60_000;

const takeAddressRequest = createRateLimiter({
  limit: PASSWORD_RESET_REQUESTS_PER_HOUR,
  windowMs: 60 * MINUTE_MS,
});
const takeAccountEmail = createRateLimiter({
  limit: 1,
  windowMs: PASSWORD_RESET_EMAIL_INTERVAL_MINUTES * MINUTE_MS,
});

/** Mails the account its reset link when the email is the account's. Never throws. */
const sendResetLink = async (username: string, email: string) => {
  try {
    const account = await prisma.mEMB_INFO.findUnique({
      where: { memb___id: username },
      select: { memb___id: true, memb__pwd: true, mail_addr: true },
    });
    const accountEmail = account?.mail_addr?.trim();
    if (
      !account ||
      !accountEmail ||
      accountEmail.toLowerCase() !== email.trim().toLowerCase() ||
      !takeAccountEmail(account.memb___id.toLowerCase())
    ) {
      return;
    }

    const expires =
      Math.floor(Date.now() / 1000) + PASSWORD_RESET_LINK_MINUTES * 60;
    const token = createPasswordResetToken(
      {
        username: account.memb___id,
        password: account.memb__pwd,
        email: accountEmail,
      },
      expires,
      getAuthSecret(),
    );
    await sendMail({
      to: accountEmail,
      ...passwordResetEmail({
        username: account.memb___id,
        link: getAbsoluteUrl(
          `/reset-password?token=${encodeURIComponent(token)}`,
        ),
        minutes: PASSWORD_RESET_LINK_MINUTES,
      }),
    });
  } catch (error) {
    console.error("Password reset: the link could not be sent", error);
  }
};

export async function requestPasswordResetAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const validated = requestPasswordResetSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: flattenError(validated.error).fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }

  if (!takeAddressRequest(getClientAddress(await headers()))) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  // The same answer whether or not the account and email match, and the email goes out after it, so
  // neither the answer nor its time tells which accounts exist.
  const { username, email } = validated.data;
  after(() => sendResetLink(username, email));

  return { success: true, message: PASSWORD_RESET_SENT_MESSAGE };
}
