import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { jlptLevels, jlptDescriptions, jlptVocab } from "@/data/jlpt";
import { setLevel } from "./actions";

export default async function JlptPage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Níveis JLPT</h1>
      <p className="mt-1 text-[var(--muted)]">
        A JLPT (Japanese-Language Proficiency Test) tem 5 níveis, do N5 (mais
        fácil) ao N1 (mais difícil). Escolha seu nível atual.
      </p>

      <div className="mt-6 space-y-3">
        {jlptLevels.map((level) => {
          const isCurrent = profile.jlpt_level === level;
          return (
            <div
              key={level}
              className={`rounded-2xl border p-5 ${
                isCurrent
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{level}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs font-medium text-[var(--primary-foreground)]">
                        seu nível
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {jlptDescriptions[level]}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {jlptVocab[level].length.toLocaleString("pt-BR")} palavras
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/jlpt/${level}`}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Ver vocabulário
                </Link>
                <Link
                  href={`/flashcards/jlpt-${level}`}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                >
                  Flashcards
                </Link>
                {!isCurrent && (
                  <form action={setLevel.bind(null, level)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                    >
                      Definir como meu nível
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
