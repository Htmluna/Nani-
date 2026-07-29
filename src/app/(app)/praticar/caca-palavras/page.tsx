import Link from "next/link";
import WordSearch from "@/components/practice/WordSearch";
import StudyTimer from "@/components/StudyTimer";
import { requireProfile } from "@/lib/auth";

export default async function CacaPalavrasPage() {
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
          <h1 className="text-2xl font-bold">Caça-palavras 🔎</h1>
          <p className="text-sm text-[var(--muted)]">
            Ache as palavras escondidas usando as famílias já liberadas.
          </p>
        </div>
        <StudyTimer activity="praticar:caca-palavras" />
      </div>

      <WordSearch />
    </div>
  );
}
