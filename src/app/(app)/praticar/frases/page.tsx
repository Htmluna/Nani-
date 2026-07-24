import Link from "next/link";
import SentenceBuilder from "@/components/practice/SentenceBuilder";
import StudyTimer from "@/components/StudyTimer";
import { requireProfile } from "@/lib/auth";
import { sentences } from "@/data/sentences";

export default async function FrasesPage() {
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
          <h1 className="text-2xl font-bold">Formar frases 📝</h1>
          <p className="text-sm text-[var(--muted)]">
            Leia a tradução e coloque as palavras na ordem certa.
          </p>
        </div>
        <StudyTimer activity="praticar:frases" />
      </div>

      <SentenceBuilder sentences={sentences} />
    </div>
  );
}
