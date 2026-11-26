import { z } from "zod";
import { passwordSchema } from "./shared";

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1).max(100),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
