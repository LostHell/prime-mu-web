import { z } from "zod";

export const changeEmailSchema = z.object({
  newEmail: z
    .string()
    .email("Please enter a valid email address")
    .max(50, "Email must be at most 50 characters"),
  currentPassword: z.string().min(1, "Password is required for verification"),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
