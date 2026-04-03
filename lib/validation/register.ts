import { z } from "zod";
import { passwordSchema, usernameSchema } from "./shared";

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: z
      .string()
      .email("Please provide a valid email address.")
      .max(50, "Email must be at most 50 characters."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
