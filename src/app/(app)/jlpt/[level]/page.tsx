import Link from "next/link";
import { notFound } from "next/navigation";
import StudyTimer from "@/components/StudyTimer";
import {
  jlptVocab,
  jlptDescriptions,
  jlptLevels,
  type JlptLevel,
} from "@/data/jlpt";

const PER_PAGE = 100;

export default async function LevelPage({
  params,
  searchParams,
}: {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { level } = await params;
  if (!jlptLevels.includes(level as JlptLevel)) notFound();
  const lv = level as JlptLevel;
  const vocab = jlptVocab[lv];

  const { page } = await searchParams;
  const totalPages = Math.max(1, Math.ceil(vocab.length / PER_PAGE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (current - 1) * PER_PAGE;
  const slice = vocab.slice(start, start + PER_PAGE);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/jlpt"
            className="text-sm text-[var(--muted)] hover:underline"
          >
            ← Níveis JLPT
          </Link>
          <h1 className="text-2xl font-bold">Vocabulário {lv}</h1>
          <p className="text-sm text-[var(--muted)]">{jlptDescriptions[lv]}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {vocab.length} palavras · página {current} de {totalPages}
          </p>
        </div>
        <StudyTimer activity={`jlpt:${lv}`} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-left">
          <thead className="bg-[var(--card)] text-sm text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Palavra</th>
              <th className="px-4 py-3">Leitura</th>
              <th className="px-4 py-3">Significado (EN)</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((v, i) => (
              <tr
                key={`${v.word}-${start + i}`}
                className="border-t border-[var(--border)] bg-[var(--card)]"
              >
                <td className="jp px-4 py-3 text-xl">{v.word}</td>
                <td className="jp px-4 py-3 text-[var(--muted)]">
                  {v.reading}
                </td>
                <td className="px-4 py-3">{v.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <PageLink
          level={lv}
          page={current - 1}
          disabled={current <= 1}
          label="← Anterior"
        />
        <span className="text-sm text-[var(--muted)]">
          {current} / {totalPages}
        </span>
        <PageLink
          level={lv}
          page={current + 1}
          disabled={current >= totalPages}
          label="Próxima →"
        />
      </div>

      <div className="mt-6 text-center">
        <Link
          href={`/flashcards/jlpt-${lv}`}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)]"
        >
          Treinar {lv} com flashcards →
        </Link>
      </div>
    </div>
  );
}

function PageLink({
  level,
  page,
  disabled,
  label,
}: {
  level: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled)
    return (
      <span className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] opacity-50">
        {label}
      </span>
    );
  return (
    <Link
      href={`/jlpt/${level}?page=${page}`}
      className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--background)]"
    >
      {label}
    </Link>
  );
}
