"use server";

import { flattenError } from "zod";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validation/login";
import { ActionState } from "@/lib/types/action-state";
import { AuthError } from "next-auth";

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const validatedFields = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: flattenError(validatedFields.error).fieldErrors,
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
        success: false,
        message: "Invalid username or password.",
      };
    }

    throw error;
  }

  return {};
}
