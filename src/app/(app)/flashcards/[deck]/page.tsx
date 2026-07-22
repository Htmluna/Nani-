import Link from "next/link";
import { notFound } from "next/navigation";
import FlashcardTrainer from "@/components/FlashcardTrainer";
import StudyTimer from "@/components/StudyTimer";
import { buildDeck, type Card } from "@/data/decks";

const SESSION_SIZE = 40;

// Sorteia uma amostra de cartas para a sessão (baralhos grandes têm milhares).
function sample(cards: Card[], n: number): Card[] {
  if (cards.length <= n) return cards;
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export default async function DeckPage({
  params,
}: {
  params: Promise<{ deck: string }>;
}) {
  const { deck: slug } = await params;
  const deck = buildDeck(slug);
  if (!deck) notFound();

  const cards = sample(deck.cards, SESSION_SIZE);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/flashcards"
            className="text-sm text-[var(--muted)] hover:underline"
          >
            ← Flashcards
          </Link>
          <h1 className="text-2xl font-bold">{deck.name}</h1>
          <p className="text-sm text-[var(--muted)]">{deck.description}</p>
          {deck.cards.length > SESSION_SIZE && (
            <p className="mt-1 text-xs text-[var(--muted)]">
              Sessão de {cards.length} cartas sorteadas de {deck.cards.length}.
              Recarregue para um novo conjunto.
            </p>
          )}
        </div>
        <StudyTimer activity={`flashcards:${slug}`} />
      </div>

      <FlashcardTrainer cards={cards} />
    </div>
  );
}
