"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

const initial: LoginState = {};

export default function AdminLogin() {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-sm rounded-lg border border-border bg-surface-alt p-8">
        <h1 className="font-serif text-2xl font-semibold text-moss-deep">Administrace</h1>
        <form action={action} className="mt-6 space-y-4">
          <label className="block"><span className="text-sm font-medium">Uživatel</span>
            <input name="username" required autoComplete="username"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none" /></label>
          <label className="block"><span className="text-sm font-medium">Heslo</span>
            <input name="password" type="password" required autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none" /></label>
          {state.error ? <p className="rounded-md bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{state.error}</p> : null}
          <button type="submit" disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
            {pending ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </section>
  );
}
