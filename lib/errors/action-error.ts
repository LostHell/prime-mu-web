import { randomUUID } from "node:crypto";

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof ActionError) return err.message;
  const reference = randomUUID();
  console.error("Action failed", {
    reference,
    operation: fallback,
    type: err instanceof Error ? err.name : "UnknownError",
    code:
      err && typeof err === "object" && "code" in err
        ? String(err.code)
        : undefined,
  });
  return `${fallback} Reference: ${reference}.`;
};
