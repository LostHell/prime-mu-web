"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PASSWORD_RESET_EMAIL_INTERVAL_MINUTES } from "@/constants/password-reset";
import { requestPasswordResetAction } from "@/lib/actions/request-password-reset";
import { type ActionState } from "@/lib/types/action-state";
import { useActionState, useEffect, useState } from "react";

const initialState: ActionState = {};

const LOCK_MS = PASSWORD_RESET_EMAIL_INTERVAL_MINUTES * 60 * 1000;

/** 299 999 ms -> "5:00" */
const formatWait = (milliseconds: number): string => {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export function ForgotPasswordForm() {
  // After a link is sent, the button waits as long as the server waits before it mails the
  // account again, so a second click cannot only spend the address's requests of the hour.
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [state, formAction, isPending] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const result = await requestPasswordResetAction(previous, formData);
      if (result.success) {
        const sentAt = Date.now();
        setNow(sentAt);
        setLockedUntil(sentAt + LOCK_MS);
      }
      return result;
    },
    initialState,
  );

  useEffect(() => {
    if (lockedUntil === null) return;
    const tick = () => {
      const current = Date.now();
      if (current >= lockedUntil) setLockedUntil(null);
      else setNow(current);
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null;

  return (
    <form action={formAction} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" name="username" placeholder="Username" />
        {state.errors?.username && (
          <FieldError>{state.errors.username[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="The account's email"
        />
        {state.errors?.email && (
          <FieldError>{state.errors.email[0]}</FieldError>
        )}
      </Field>

      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending || isLocked}>
        {isPending
          ? "Sending..."
          : isLocked
            ? `Send again in ${formatWait(lockedUntil - now)}`
            : "Send reset link"}
      </Button>
    </form>
  );
}
