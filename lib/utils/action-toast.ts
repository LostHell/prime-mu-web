"use client";

import type { ActionState } from "@/lib/types/action-state";
import { toast } from "sonner";

export type FormAction = (
  state: ActionState,
  formData: FormData,
) => Promise<ActionState>;

export function showActionToast(result: ActionState) {
  if (!result.message) return;
  if (result.success) {
    toast.success(result.message);
  } else {
    toast.error(result.message);
  }
}

/**
 * Wraps a server action so feedback is toasted as soon as the action resolves.
 * A post-action `useEffect` can miss success toasts when revalidation removes
 * the submitting UI (e.g. cancel listing on My Listings).
 */
export function withActionToast(action: FormAction): FormAction {
  return async (state, formData) => {
    const result = await action(state, formData);
    showActionToast(result);
    return result;
  };
}
