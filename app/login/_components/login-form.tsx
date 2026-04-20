"use client";

import { loginAction } from "@/actions/login";
import { Button } from "@/components/ui/button";
import FieldLabel from "@/components/ui/field-label";
import { Input } from "@/components/ui/input";
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
      <div>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" name="username" placeholder="Username" />
        {state.errors?.username && (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.username[0]}
          </p>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
        />
        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {state.message && <p className="text-sm text-red-400">{state.message}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
