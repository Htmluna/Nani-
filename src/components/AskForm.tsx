"use client";

import { useActionState } from "react";
import { askQuestion, type AskState } from "@/app/(app)/perguntas/actions";

const initial: AskState = {};

export default function AskForm({
  candidates,
}: {
  candidates: { id: string; username: string }[];
}) {
  const [state, action, pending] = useActionState(askQuestion, initial);

  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm text-[var(--muted)]">
        Para enviar perguntas, entre em um grupo na aba{" "}
        <strong>Competição</strong> — você poderá desafiar os outros membros.
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Enviar para</span>
        <select
          name="target_id"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
        >
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.username}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Pergunta</span>
        <textarea
          name="prompt"
          rows={2}
          placeholder="ex.: Como se escreve 'água' em kanji?"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
        />
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="col-span-2 block">
          <span className="mb-1 block text-sm font-medium">
            Resposta correta
          </span>
          <input
            name="correct_answer"
            placeholder="ex.: 水"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Pontos</span>
          <input
            name="points"
            type="number"
            defaultValue={10}
            min={1}
            max={100}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
          />
        </label>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Se a pessoa acertar, vocês dois ganham os pontos. 🤝
      </p>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}

      <button
        disabled={pending}
        className="w-full rounded-lg bg-[var(--primary)] py-2.5 font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar pergunta"}
      </button>
    </form>
  );
}
