"use client";

import { useActionState } from "react";
import {
  createGroup,
  joinGroup,
  type GroupState,
} from "@/app/(app)/competicao/actions";

const initial: GroupState = {};

export default function GroupForms() {
  const [createState, createAction, creating] = useActionState(
    createGroup,
    initial
  );
  const [joinState, joinAction, joining] = useActionState(joinGroup, initial);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form
        action={createAction}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
      >
        <h3 className="font-semibold">Criar um grupo</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Você recebe um código para convidar amigos.
        </p>
        <input
          name="name"
          placeholder="Nome do grupo"
          className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
        />
        {createState.error && (
          <p className="mt-2 text-sm text-red-600">{createState.error}</p>
        )}
        <button
          disabled={creating}
          className="mt-3 w-full rounded-lg bg-[var(--primary)] py-2 font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
        >
          {creating ? "Criando..." : "Criar grupo"}
        </button>
      </form>

      <form
        action={joinAction}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
      >
        <h3 className="font-semibold">Entrar em um grupo</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Cole o código que um amigo compartilhou.
        </p>
        <input
          name="code"
          placeholder="Código do convite"
          className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
        />
        {joinState.error && (
          <p className="mt-2 text-sm text-red-600">{joinState.error}</p>
        )}
        <button
          disabled={joining}
          className="mt-3 w-full rounded-lg bg-[var(--accent)] py-2 font-semibold text-white disabled:opacity-60"
        >
          {joining ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
