import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters.")
  .max(10, "Username must be at most 10 characters.")
  .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers.");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(10, "Password must be at most 10 characters.");
