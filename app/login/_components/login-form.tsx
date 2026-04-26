"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/login";
import { AuthFormState } from "@/lib/validation/types";
import { useActionState } from "react";

const initialState: AuthFormState = {};

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

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
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        {state.errors?.password && (
          <FieldError>{state.errors.password[0]}</FieldError>
        )}
      </Field>

      {state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
