"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePasswordAction } from "@/lib/actions/change-password";
import { useActionState } from "react";
import { UserPanelPageLayout } from "../../_components/user-panel-page-layout";

export default function ChangePasswordPage() {
  const [state, action, isPending] = useActionState(changePasswordAction, {});

  return (
    <UserPanelPageLayout
      title="Change Password"
      description="Update your account password"
    >
      <form action={action} className="space-y-6">
        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
            disabled={isPending}
          />
          {state.errors?.currentPassword && (
            <FieldError>{state.errors.currentPassword[0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="6-10 characters"
            disabled={isPending}
          />
          {state.errors?.newPassword && (
            <FieldError>{state.errors.newPassword[0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirm New Password
          </FieldLabel>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repeat new password"
            disabled={isPending}
          />
          {state.errors?.confirmPassword && (
            <FieldError>{state.errors.confirmPassword[0]}</FieldError>
          )}
        </Field>

        {state.message && (
          <Alert variant={state.success ? "success" : "destructive"}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </UserPanelPageLayout>
  );
}
