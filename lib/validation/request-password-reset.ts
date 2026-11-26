import { z } from "zod";
import { usernameSchema } from "./shared";

export const requestPasswordResetSchema = z.object({
  username: usernameSchema,
  email: z
    .email("Please provide a valid email address.")
    .max(50, "Email must be at most 50 characters."),
});

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
