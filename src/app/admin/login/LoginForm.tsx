"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type FormState } from "../actions";

const initial: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full">
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-cream-muted">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-cream/15 bg-ink-700 px-4 py-3 text-cream outline-none transition-colors focus:border-gold/60"
          placeholder="••••••••"
        />
      </div>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-wine-light/40 bg-wine-deep/40 px-3 py-2 text-sm text-cream"
        >
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
