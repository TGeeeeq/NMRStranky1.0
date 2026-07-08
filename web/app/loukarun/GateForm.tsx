"use client";

import { useActionState } from "react";
import { redeemGameCode, type RedeemState } from "./actions";

/** Formulář pro uplatnění pozvánkového kódu ke hře. */
export function GateForm({ highlight }: { highlight?: boolean }) {
  const [state, action, pending] = useActionState<RedeemState, FormData>(redeemGameCode, {});

  return (
    <form action={action} className="mx-auto flex w-full max-w-md flex-col gap-3">
      {highlight && (
        <p className="rounded-md bg-accent/40 px-4 py-2 text-center text-sm text-moss-deep">
          Ke spuštění hry potřebuješ pozvánkový kód.
        </p>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-moss-deep">Pozvánkový kód</span>
        <input
          name="code"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="LOUKA-XXXX-XXXX"
          className="w-full rounded-md border border-border bg-surface px-4 py-3 text-center font-mono text-lg tracking-[0.15em] uppercase focus:border-moss focus:outline-none"
        />
      </label>
      {state.error && <p className="text-center text-sm text-danger">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-moss px-8 py-3 text-base font-semibold text-cream transition hover:bg-moss-deep disabled:opacity-60"
      >
        {pending ? "Ověřuji…" : "Vstoupit na Louku"}
      </button>
    </form>
  );
}
