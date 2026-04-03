"use client";

import { registerAction } from "@/app/actions/auth-actions";
import { AuthFormState } from "@/lib/validation/auth";
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
        <input id="username" name="username" className="input-gold" placeholder="Choose username (4-10 chars)" />
        {state.errors?.username && <p className="mt-1 text-sm text-red-400">{state.errors.username[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" className="input-gold" placeholder="Enter email" />
        {state.errors?.email && <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" className="input-gold" placeholder="Choose password" />
        {state.errors?.password && <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="input-gold"
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
