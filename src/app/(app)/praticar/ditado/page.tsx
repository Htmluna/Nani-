import Link from "next/link";
import Dictation from "@/components/practice/Dictation";
import StudyTimer from "@/components/StudyTimer";
import { requireProfile } from "@/lib/auth";
import { wordsForGroups } from "@/data/words";

export default async function DitadoPage() {
  const profile = await requireProfile();
  const words = wordsForGroups(profile.taught_groups);

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
          <h1 className="text-2xl font-bold">Ditado 🎧</h1>
          <p className="text-sm text-[var(--muted)]">
            Ouça a palavra e descubra quais letras foram usadas.
          </p>
        </div>
        <StudyTimer activity="praticar:ditado" />
      </div>

      <Dictation words={words} />
    </div>
  );
}
