"use client";

import { changeEmailAction } from "@/actions/change-email";
import { changePasswordAction } from "@/actions/change-password";
import { Feedback } from "@/components/ui/feedback";
import { FieldLabel } from "@/components/ui/field-label";
import { ChevronRight, Key, Lock, Mail, Settings } from "lucide-react";
import { useActionState, useState } from "react";

export function AccountSettings() {
  const [isOpen, setIsOpen] = useState(true);

  const [pwState, pwAction, pwPending] = useActionState(
    changePasswordAction,
    {},
  );
  const [emailState, emailAction, emailPending] = useActionState(
    changeEmailAction,
    {},
  );

  return (
    <div className="mt-8">
      <button
        className="flex items-center gap-3 w-full mb-4"
        onClick={() => setIsOpen((v) => !v)}
      >
        <Settings className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
        <h2 className="section-title">Account Settings</h2>
        <ChevronRight
          className="w-4 h-4 ml-auto transition-transform duration-200"
          style={{
            color: "hsl(var(--gold))",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Change Password */}
          <div className="card-dark p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
              <h3
                className="font-serif text-base font-bold uppercase tracking-widest"
                style={{ color: "hsl(var(--gold))" }}
              >
                Change Password
              </h3>
            </div>
            <div className="ornament-line mb-4" />
            <form action={pwAction} className="space-y-4">
              <div>
                <FieldLabel>Current Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current password"
                    className="input-gold pl-9"
                    disabled={pwPending}
                  />
                </div>
                {pwState.errors?.currentPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {pwState.errors.currentPassword[0]}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>New Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password (6–10 chars)"
                    className="input-gold pl-9"
                    disabled={pwPending}
                  />
                </div>
                {pwState.errors?.newPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {pwState.errors.newPassword[0]}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>Confirm New Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat new password"
                    className="input-gold pl-9"
                    disabled={pwPending}
                  />
                </div>
                {pwState.errors?.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {pwState.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
              {pwState.message && (
                <Feedback
                  type={pwState.success ? "success" : "error"}
                  message={pwState.message}
                />
              )}
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={pwPending}
              >
                {pwPending ? "Saving..." : "Save Password"}
              </button>
            </form>
          </div>

          {/* Change Email */}
          <div className="card-dark p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5" style={{ color: "hsl(var(--gold))" }} />
              <h3
                className="font-serif text-base font-bold uppercase tracking-widest"
                style={{ color: "hsl(var(--gold))" }}
              >
                Change Email
              </h3>
            </div>
            <div className="ornament-line mb-4" />
            <form action={emailAction} className="space-y-4">
              <div>
                <FieldLabel>New Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    name="newEmail"
                    placeholder="New email address"
                    className="input-gold pl-9"
                    disabled={emailPending}
                  />
                </div>
                {emailState.errors?.newEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {emailState.errors.newEmail[0]}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>Current Password</FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Confirm with your password"
                    className="input-gold pl-9"
                    disabled={emailPending}
                  />
                </div>
                {emailState.errors?.currentPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {emailState.errors.currentPassword[0]}
                  </p>
                )}
              </div>
              {emailState.message && (
                <Feedback
                  type={emailState.success ? "success" : "error"}
                  message={emailState.message}
                />
              )}
              <button
                type="submit"
                className="btn-gold w-full"
                disabled={emailPending}
              >
                {emailPending ? "Saving..." : "Save Email"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
