/** Shared return shape for `useActionState` server actions (forms, panels, etc.). */
export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
