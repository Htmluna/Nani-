"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Card } from "@/data/decks";
import { reviewCard } from "@/app/(app)/flashcards/actions";
import { shuffle } from "@/lib/shuffle";

export default function FlashcardTrainer({ cards }: { cards: Card[] }) {
  // Embaralha só depois de montar: no servidor a ordem tem que bater com a
  // renderização inicial, e o sorteio é aleatório.
  const [deck, setDeck] = useState<Card[]>(cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(shuffle(cards));
    setI(0);
    setFlipped(false);
    setHits(0);
    setDone(false);
  }, [cards]);

  const card = deck[i];

  function answer(correct: boolean) {
    reviewCard(card.id, correct); // dispara sem bloquear a UI
    if (correct) setHits((h) => h + 1);
    if (i + 1 >= deck.length) {
      setDone(true);
    } else {
      setI(i + 1);
      setFlipped(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="mt-3 text-xl font-bold">Sessão concluída!</h2>
        <p className="mt-2 text-[var(--muted)]">
          Você acertou {hits} de {deck.length} cartas.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              // Reembaralha, para a repetição não vir na mesma ordem.
              setDeck(shuffle(deck));
              setI(0);
              setFlipped(false);
              setHits(0);
              setDone(false);
            }}
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)]"
          >
            Repetir
          </button>
          <Link
            href="/flashcards"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 font-semibold"
          >
            Outros decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>
          Carta {i + 1} de {deck.length}
        </span>
        <span>✅ {hits}</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center transition hover:border-[var(--primary)]"
      >
        {!flipped ? (
          <span className={card.jp ? "jp text-7xl" : "text-4xl font-bold"}>
            {card.front}
          </span>
        ) : (
          <>
            <span className="text-3xl font-bold text-[var(--primary)]">
              {card.back}
            </span>
            {card.sub && (
              <span className="mt-2 text-lg text-[var(--muted)]">
                {card.sub}
              </span>
            )}
          </>
        )}
        <span className="mt-6 text-xs text-[var(--muted)]">
          {flipped ? "toque para virar" : "toque para revelar"}
        </span>
      </button>

      {flipped ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => answer(false)}
            className="rounded-lg border border-[var(--border)] py-3 font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Errei
          </button>
          <button
            onClick={() => answer(true)}
            className="rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Acertei
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="mt-4 w-full rounded-lg bg-[var(--primary)] py-3 font-semibold text-[var(--primary-foreground)]"
        >
          Revelar resposta
        </button>
      )}
    </div>
  );
}
