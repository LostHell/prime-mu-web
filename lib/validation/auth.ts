import { z } from "zod";

const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters.")
  .max(10, "Username must be at most 10 characters.")
  .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers.");

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(10, "Password must be at most 10 characters.");

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: z.email("Please provide a valid email address.").max(50, "Email must be at most 50 characters."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type AuthFormState = {
  message?: string;
  errors?: Record<string, string[]>;
};
