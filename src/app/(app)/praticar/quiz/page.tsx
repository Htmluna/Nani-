import Link from "next/link";
import MeaningQuiz from "@/components/practice/MeaningQuiz";
import StudyTimer from "@/components/StudyTimer";
import { requireProfile } from "@/lib/auth";

export default async function QuizPage() {
  await requireProfile();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/praticar"
            className="text-sm text-[var(--muted)] hover:underline"
          >
            ← Praticar
          </Link>
          <h1 className="text-2xl font-bold">Quiz ❓</h1>
          <p className="text-sm text-[var(--muted)]">
            Múltipla escolha: significado, leitura e escrita das palavras
            liberadas.
          </p>
        </div>
        <StudyTimer activity="praticar:quiz" />
      </div>

      <MeaningQuiz />
    </div>
  );
}
