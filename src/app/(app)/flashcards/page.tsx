import Link from "next/link";
import { deckList } from "@/data/decks";

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Flashcards</h1>
      <p className="mt-1 text-[var(--muted)]">
        Escolha um baralho para revisar. Cada acerto vale +1 ponto e ajusta a
        repetição espaçada.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {deckList.map((d) => (
          <Link
            key={d.slug}
            href={`/flashcards/${d.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]"
          >
            <span className="jp text-2xl text-[var(--primary)]">{d.sample}</span>
            <span className="font-semibold">{d.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
