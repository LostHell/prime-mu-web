"use server";

import { flattenError } from "zod";
import { encodePassword } from "@/lib/auth/password";
import {
  isPasswordResetTokenValid,
  readPasswordResetToken,
} from "@/lib/auth/password-reset-token";
import { getAuthSecret } from "@/lib/auth/secret";
import { ActionState } from "@/lib/types/action-state";
import { resetPasswordSchema } from "@/lib/validation/reset-password";
import { prisma } from "@/prisma/prisma";

const LINK_NOT_VALID: ActionState = {
  success: false,
  message:
    "This link has run out or was already used. Ask for a new one on the forgot password page.",
};

export async function resetPasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const validated = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return {
      success: false,
      errors: flattenError(validated.error).fieldErrors,
      message: "Please correct the errors.",
    };
  }

  const { token, newPassword } = validated.data;
  const named = readPasswordResetToken(token);
  if (!named) {
    return LINK_NOT_VALID;
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
      Math.floor(Date.now() / 1000),
      getAuthSecret(),
    )
  ) {
    return LINK_NOT_VALID;
  }

  // Only over the password the link was made for: a second use of the link at the same time finds
  // it changed. The new password also ends every session made with the old one (auth.ts).
  const { count } = await prisma.mEMB_INFO.updateMany({
    where: { memb___id: account.memb___id, memb__pwd: account.memb__pwd },
    data: { memb__pwd: encodePassword(account.memb___id, newPassword) },
  });
  if (count === 0) {
    return LINK_NOT_VALID;
  }

  return {
    success: true,
    message: "Your password has been changed. You can log in with it now.",
  };
}
