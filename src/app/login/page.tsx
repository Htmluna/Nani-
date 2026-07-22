"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthState } from "./actions";

const initial: AuthState = {};

export default function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const action = mode === "entrar" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="jp text-5xl font-bold text-[var(--primary)]">日本語</div>
          <h1 className="mt-3 text-2xl font-bold">Nani?!</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Estude japonês e compita com amigos.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-[var(--background)] p-1">
            <button
              type="button"
              onClick={() => setMode("entrar")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "entrar"
                  ? "bg-[var(--card)] shadow-sm"
                  : "text-[var(--muted)]"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("criar")}
              className={`rounded-md py-2 text-sm font-medium transition ${
                mode === "criar"
                  ? "bg-[var(--card)] shadow-sm"
                  : "text-[var(--muted)]"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form action={formAction} className="space-y-4">
            {mode === "criar" && (
              <Field
                label="Nome de usuário"
                name="username"
                type="text"
                placeholder="ex.: luana"
              />
            )}
            <Field
              label="E-mail"
              name="email"
              type="email"
              placeholder="voce@email.com"
            />
            <Field
              label="Senha"
              name="password"
              type="password"
              placeholder="mínimo 6 caracteres"
            />

            {state.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {state.error}
              </p>
            )}
            {state.message && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[var(--primary)] py-2.5 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:opacity-60"
            >
              {pending
                ? "Aguarde..."
                : mode === "entrar"
                  ? "Entrar"
                  : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
      />
    </label>
  );
}
