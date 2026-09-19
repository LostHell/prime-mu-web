export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof ActionError ? err.message : fallback;
