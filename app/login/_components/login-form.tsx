"use client";

import { loginAction } from "@/actions/login";
import { AuthFormState } from "@/lib/validation/types";
import { useActionState } from "react";

const initialState: AuthFormState = {};

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold">
          Username
        </label>
        <input id="username" name="username" className="input-gold" placeholder="Enter username" />
        {state.errors?.username && <p className="mt-1 text-sm text-red-400">{state.errors.username[0]}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <input id="password" name="password" type="password" className="input-gold" placeholder="Enter password" />
        {state.errors?.password && <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>}
      </div>

      {state.message && <p className="text-sm text-red-400">{state.message}</p>}

      <button type="submit" className="btn-gold w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
