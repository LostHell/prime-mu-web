"use client";

import { Button } from "@/components/ui/button";
import Feedback from "@/components/ui/feedback";
import FieldLabel from "@/components/ui/field-label";
import Headline from "@/components/ui/headline";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { changeEmailAction } from "@/lib/actions/change-email";
import { Lock, Mail } from "lucide-react";
import { useActionState } from "react";

export default function ChangeEmailPage() {
  const [state, action, isPending] = useActionState(changeEmailAction, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <Headline>
        <Text as="h1" variant="h4">
          Change Email
        </Text>
        <Text variant="small">Update your account email address</Text>
      </Headline>

      <div className="card-dark max-w-md p-6">
        <form action={action} className="space-y-4">
          <div>
            <FieldLabel htmlFor="newEmail">New Email Address</FieldLabel>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="email"
                id="newEmail"
                name="newEmail"
                placeholder="Enter new email"
                className="pl-10"
                disabled={isPending}
              />
            </div>
            {state.errors?.newEmail && (
              <p className="text-crimson mt-1 text-xs">
                {state.errors.newEmail[0]}
              </p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <div className="relative">
              <Lock className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Confirm with your password"
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
    </div>
  );
}
