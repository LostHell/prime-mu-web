"use server";

import { flattenError } from "zod";
import { encodePassword, verifyPassword } from "@/lib/auth/password";
import { findPasswordResetAccount } from "@/lib/queries/get-password-reset-account";
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
  const account = await findPasswordResetAccount(token);
  if (!account) {
    return LINK_NOT_VALID;
  }

  // The same password stores the same bytes: the link would keep working, and the other sessions
  // would not end.
  if (verifyPassword({ password: newPassword, account })) {
    return {
      success: false,
      errors: {
        newPassword: ["Choose a password different from your current one."],
      },
      message: "Please correct the errors.",
    };
  }

  // Only over the password the link was made for: a second use of the link at the same time finds
  // it changed. The new password also ends every session made with the old one (auth.ts).
  const { count } = await prisma.mEMB_INFO.updateMany({
    where: { memb___id: account.username, memb__pwd: account.password },
    data: { memb__pwd: encodePassword(account.username, newPassword) },
  });
  if (count === 0) {
    return LINK_NOT_VALID;
  }

  return {
    success: true,
    message: "Your password has been changed. You can log in with it now.",
  };
}
