"use client";

import { useState } from "react";
import { answerQuestion } from "@/app/(app)/perguntas/actions";

export default function AnswerForm({
  questionId,
  points,
}: {
  questionId: string;
  points: number;
}) {
  const [answer, setAnswer] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<
    { correct: boolean } | { error: string } | null
  >(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || pending) return;
    setPending(true);
    const res = await answerQuestion(questionId, answer.trim());
    setPending(false);
    if (!res.ok) setResult({ error: res.error ?? "Erro ao responder." });
    else setResult({ correct: !!res.correct });
  }

  if (result && "correct" in result) {
    return (
      <div
        className={`rounded-lg px-3 py-2 text-sm font-medium ${
          result.correct
            ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
        }`}
      >
        {result.correct
          ? `✅ Acertou! +${points} pontos para vocês dois.`
          : "❌ Não foi dessa vez. A resposta estava incorreta."}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Sua resposta"
        className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 outline-none focus:border-[var(--primary)]"
      />
      <button
        disabled={pending}
        className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "..." : "Responder"}
      </button>
      {result && "error" in result && (
        <p className="text-sm text-red-600">{result.error}</p>
      )}
    </form>
  );
}
