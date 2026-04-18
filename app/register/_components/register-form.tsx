"use client";

import { registerAction } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { AuthFormState } from "@/lib/validation/types";
import { useActionState } from "react";

const initialState: AuthFormState = {};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold">
          Username
        </label>
        <Input id="username" name="username" placeholder="Choose username (4-10 chars)" />
        {state.errors?.username && <p className="mt-1 text-sm text-red-400">{state.errors.username[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="Enter email" />
        {state.errors?.email && <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <Input id="password" name="password" type="password" placeholder="Choose password" />
        {state.errors?.password && <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
          Confirm password
        </label>
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

      <button type="submit" className="btn-gold w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default RegisterForm;
