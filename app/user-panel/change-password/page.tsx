"use client";

import { changePasswordAction } from "@/actions/change-password";
import Feedback from "@/components/ui/feedback";
import FieldLabel from "@/components/ui/field-label";
import { Input } from "@/components/ui/input";
import { Key, Lock } from "lucide-react";
import { useActionState } from "react";

export default function ChangePasswordPage() {
  const [state, action, isPending] = useActionState(changePasswordAction, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <Key className="size-6 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold gold-gradient-text">
            Change Password
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your account password
          </p>
        </div>
      </div>

      <div className="card-dark p-6 max-w-md">
        <form action={action} className="space-y-4">
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
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
            <FieldLabel>New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
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
            <FieldLabel>Confirm New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
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

          <button type="submit" className="btn-gold w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
