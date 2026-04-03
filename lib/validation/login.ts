import { z } from "zod";
import { passwordSchema, usernameSchema } from "./shared";

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
