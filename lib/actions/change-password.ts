"use server";

import { changePasswordSchema } from "@/lib/validation/change-password";
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
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the errors.",
    };
  }

  const account = await prisma.mEMB_INFO.findUnique({
    where: { memb___id: accountId },
  });

  if (!account || account.memb__pwd !== validated.data.currentPassword) {
    return { success: false, message: "Current password is incorrect." };
  }

  await prisma.mEMB_INFO.update({
    where: { memb___id: accountId },
    data: { memb__pwd: validated.data.newPassword },
  });

  return { success: true, message: "Password changed successfully." };
}
