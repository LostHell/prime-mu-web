"use client";

import { changePasswordAction } from "@/actions/change-password";
import { Button } from "@/components/ui/button";
import Feedback from "@/components/ui/feedback";
import FieldLabel from "@/components/ui/field-label";
import Headline from "@/components/ui/headline";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Lock } from "lucide-react";
import { useActionState } from "react";

export default function ChangePasswordPage() {
  const [state, action, isPending] = useActionState(changePasswordAction, {});

  return (
    <>
      <Headline>
        <Text as="h1" variant="h4">
          Change Password
        </Text>
        <Text variant="small">
          Update your account password
        </Text>
      </Headline>

      <div className="card-dark p-6 max-w-md">
        <form action={action} className="space-y-6">
          <div>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Enter current password"
                className="pl-10"
                disabled={isPending}
              />
            </div>
            {state.errors?.currentPassword && (
              <p className="text-xs text-crimson mt-1">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="6-10 characters"
                className="pl-10"
                disabled={isPending}
              />
            </div>
            {state.errors?.newPassword && (
              <p className="text-xs text-crimson mt-1">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat new password"
                className="pl-10"
                disabled={isPending}
              />
            </div>
            {state.errors?.confirmPassword && (
              <p className="text-xs text-crimson mt-1">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {state.message && (
            <Feedback
              type={state.success ? "success" : "error"}
              message={state.message}
            />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </>
  );
}
