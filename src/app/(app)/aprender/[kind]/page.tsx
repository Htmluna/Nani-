import Link from "next/link";
import { notFound } from "next/navigation";
import KanaStudy from "@/components/KanaStudy";
import StudyTimer from "@/components/StudyTimer";
import { getKanaSet, type KanaKind } from "@/data/kana";

export default async function KanaPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (kind !== "hiragana" && kind !== "katakana") notFound();

  const set = getKanaSet(kind as KanaKind);
  const title = kind === "hiragana" ? "Hiragana" : "Katakana";

  const sections = [
    { key: "base", label: "Básico (46 sons)", chars: set.base },
    { key: "dakuten", label: "Dakuten / Handakuten", chars: set.dakuten },
    { key: "combo", label: "Combinações (yōon)", chars: set.combo },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/aprender"
            className="text-sm text-[var(--muted)] hover:underline"
          >
            ← Alfabetos
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-[var(--muted)]">
            Toque em uma letra para ver a leitura e ouvir a pronúncia.
          </p>
        </div>
        <StudyTimer activity={`kana:${kind}`} />
      </div>

      <KanaStudy title={title} sections={sections} />

      <div className="mt-8 text-center">
        <Link
          href="/flashcards"
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)]"
        >
          Treinar com flashcards →
        </Link>
      </div>
    </div>
  );
}
