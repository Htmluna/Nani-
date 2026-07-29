import Link from "next/link";
import ComposeWord from "@/components/practice/ComposeWord";
import StudyTimer from "@/components/StudyTimer";
import { requireProfile } from "@/lib/auth";

export default async function FormarPalavrasPage() {
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
          <h1 className="text-2xl font-bold">Formar palavras 🧩</h1>
          <p className="text-sm text-[var(--muted)]">
            Veja a palavra e monte com as sílabas certas. Troque entre kanji,
            hiragana e katakana no canto.
          </p>
        </div>
        <StudyTimer activity="praticar:formar-palavras" />
      </div>

      <ComposeWord />
    </div>
  );
}
