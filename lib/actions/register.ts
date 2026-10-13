"use server";

import { flattenError } from "zod";
import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validation/register";
import { encodePassword } from "@/lib/auth/password";
import { ActionState } from "@/lib/types/action-state";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import { isUniqueConflict } from "./utils";

export async function registerAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const validatedFields = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: flattenError(validatedFields.error).fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }

  const existingAccount = await prisma.mEMB_INFO.findUnique({
    where: { memb___id: validatedFields.data.username },
    select: { memb___id: true },
  });

  if (existingAccount) {
    return {
      success: false,
      message: "This username is already taken.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.mEMB_INFO.create({
        data: {
          memb___id: validatedFields.data.username,
          memb__pwd: encodePassword(
            validatedFields.data.username,
            validatedFields.data.password,
          ),
          memb_name: validatedFields.data.username,
          mail_addr: validatedFields.data.email,
          sno__numb: "111111111111111111",
          bloc_code: "0",
        },
      });

      await tx.mEMB_STAT.create({
        data: {
          memb___id: validatedFields.data.username,
          ConnectStat: 0,
          OnlineHours: 0,
        },
      });
    });
  } catch (err) {
    if (isUniqueConflict(err)) {
      return {
        success: false,
        message: "This username is already taken.",
      };
    }
    throw err;
  }

  await signIn("credentials", {
    username: validatedFields.data.username,
    password: validatedFields.data.password,
    redirect: false,
  });

  redirect("/user-panel");
}
