"use server";

import { flattenError } from "zod";
import { changeEmailSchema } from "@/lib/validation/change-email";
import { verifyPassword } from "@/lib/auth/password";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { getAuthenticatedUser } from "./utils";

export async function changeEmailAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const accountId = await getAuthenticatedUser();
  if (!accountId) {
    return { success: false, message: "You must be logged in." };
  }

  const validated = changeEmailSchema.safeParse({
    newEmail: formData.get("newEmail"),
    currentPassword: formData.get("currentPassword"),
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
    return { success: false, message: "Password is incorrect." };
  }

  await prisma.mEMB_INFO.update({
    where: { memb___id: accountId },
    data: { mail_addr: validated.data.newEmail },
  });

  return { success: true, message: "Email updated successfully." };
}
