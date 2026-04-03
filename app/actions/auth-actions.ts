"use server";

import { signIn, signOut } from "@/auth";
import { AuthFormState, loginSchema, registerSchema } from "@/lib/validation/auth";
import { prisma } from "@/prisma/prisma";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const loginAction = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors and try again.",
    };
  }

  try {
    await signIn("credentials", {
      username: validatedFields.data.username,
      password: validatedFields.data.password,
      redirectTo: "/user-panel",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Invalid username or password.",
      };
    }

    throw error;
  }

  return {};
};

export const registerAction = async (
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
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
};

export const logoutAction = async () => {
  await signOut({ redirectTo: "/" });
};
