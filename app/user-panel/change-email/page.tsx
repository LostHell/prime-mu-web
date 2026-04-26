"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Headline from "@/components/ui/headline";
import { Input } from "@/components/ui/input";
import Text from "@/components/ui/text";
import { changeEmailAction } from "@/lib/actions/change-email";
import { useActionState } from "react";

export default function ChangeEmailPage() {
  const [state, action, isPending] = useActionState(changeEmailAction, {});

  return (
    <div className="space-y-6">
      <Headline>
        <Text as="h1" variant="h4">
          Change Email
        </Text>
        <Text variant="small">Update your account email address</Text>
      </Headline>

      <Card>
        <CardContent>
          <form action={action} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="newEmail">New Email Address</FieldLabel>
              <Input
                type="email"
                id="newEmail"
                name="newEmail"
                placeholder="Enter new email"
                disabled={isPending}
              />
              {state.errors?.newEmail && (
                <FieldError>{state.errors.newEmail[0]}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="Confirm with your password"
                disabled={isPending}
              />
              {state.errors?.currentPassword && (
                <FieldError>{state.errors.currentPassword[0]}</FieldError>
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
        </CardContent>
      </Card>
    </div>
  );
}
