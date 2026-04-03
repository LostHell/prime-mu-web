"use server";

import { signIn } from "@/auth";
import { registerSchema } from "@/lib/validation/register";
import { AuthFormState } from "@/lib/validation/types";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";

export async function registerAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }

  const existingAccount = await prisma.mEMB_INFO.findUnique({
    where: { memb___id: validatedFields.data.username },
    select: { memb___id: true },
  });

  if (existingAccount) {
    return {
      message: "This username is already taken.",
    };
  }

  await prisma.mEMB_INFO.create({
    data: {
      memb___id: validatedFields.data.username,
      memb__pwd: validatedFields.data.password,
      memb_name: validatedFields.data.username,
      mail_addr: validatedFields.data.email,
      sno__numb: "111111111111111111",
      bloc_code: "0",
    },
  });

  await prisma.mEMB_STAT.create({
    data: {
      memb___id: validatedFields.data.username,
      ConnectStat: 0,
      OnlineHours: 0,
    },
  });

  await signIn("credentials", {
    username: validatedFields.data.username,
    password: validatedFields.data.password,
    redirect: false,
  });

  redirect("/user-panel");
}
