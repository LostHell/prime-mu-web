"use client";

import { Button } from "@/components/ui/button";
import FieldLabel from "@/components/ui/field-label";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/register";
import { AuthFormState } from "@/lib/validation/types";
import { useActionState } from "react";

const initialState: AuthFormState = {};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" name="username" placeholder="Choose username (4-10 chars)" />
        {state.errors?.username && <p className="mt-1 text-sm text-red-400">{state.errors.username[0]}</p>}
      </div>

      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" placeholder="Enter email" />
        {state.errors?.email && <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>}
      </div>

      <div>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" name="password" type="password" placeholder="Choose password" />
        {state.errors?.password && <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>}
      </div>

      <div>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
        />
        {state.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      {state.message && <p className="text-sm text-red-400">{state.message}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
