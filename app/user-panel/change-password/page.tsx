"use client";

import { Button } from "@/components/ui/button";
import Feedback from "@/components/ui/feedback";
import FieldLabel from "@/components/ui/field-label";
import Headline from "@/components/ui/headline";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { changePasswordAction } from "@/lib/actions/change-password";
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
        <Text variant="small">Update your account password</Text>
      </Headline>

      <div className="card-dark max-w-md p-6">
        <form action={action} className="space-y-6">
          <div>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
              <p className="text-crimson mt-1 text-xs">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
              <p className="text-crimson mt-1 text-xs">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="confirmPassword">
              Confirm New Password
            </FieldLabel>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
              <p className="text-crimson mt-1 text-xs">
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
