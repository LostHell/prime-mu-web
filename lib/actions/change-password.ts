"use server";

import { flattenError } from "zod";
import { signIn } from "@/auth";
import { changePasswordSchema } from "@/lib/validation/change-password";
import { encodePassword, verifyPassword } from "@/lib/auth/password";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { getAuthenticatedUser } from "./utils";

export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
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

  const account = await prisma.mEMB_INFO.findUnique({
    where: { memb___id: accountId },
  });

  if (
    !account ||
    !verifyPassword({
      password: validated.data.currentPassword,
      account: {
        username: account.memb___id,
        password: account.memb__pwd,
      },
    })
  ) {
    return { success: false, message: "Current password is incorrect." };
  }

  await prisma.mEMB_INFO.update({
    where: { memb___id: accountId },
    data: {
      memb__pwd: encodePassword(account.memb___id, validated.data.newPassword),
    },
  });

  // The new password ends every session made with the old one (auth.ts), this one too: sign this
  // browser in again with it, so only the others are logged out.
  await signIn("credentials", {
    username: account.memb___id,
    password: validated.data.newPassword,
    redirect: false,
  });

  return { success: true, message: "Password changed successfully." };
}
