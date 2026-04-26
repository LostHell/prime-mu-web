"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/register";
import { AuthFormState } from "@/lib/validation/types";
import { useActionState } from "react";

const initialState: AuthFormState = {};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input
          id="username"
          name="username"
          placeholder="Choose username (4-10 chars)"
        />
        {state.errors?.username && (
          <FieldError>{state.errors.username[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="Enter email" />
        {state.errors?.email && (
          <FieldError>{state.errors.email[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Choose password"
        />
        {state.errors?.password && (
          <FieldError>{state.errors.password[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
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
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
