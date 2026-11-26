"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/lib/actions/reset-password";
import { type ActionState } from "@/lib/types/action-state";
import Link from "next/link";
import { useActionState } from "react";

const initialState: ActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  if (state.success) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <Field>
        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
        <Input
          type="password"
          id="newPassword"
          name="newPassword"
          placeholder="Enter new password"
          disabled={isPending}
        />
        {state.errors?.newPassword && (
          <FieldError>{state.errors.newPassword[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm new password"
          disabled={isPending}
        />
        {state.errors?.confirmPassword && (
          <FieldError>{state.errors.confirmPassword[0]}</FieldError>
        )}
      </Field>

      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}
