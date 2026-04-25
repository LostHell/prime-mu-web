"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validation/login";
import { AuthFormState } from "@/lib/validation/types";
import { AuthError } from "next-auth";

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
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
}
