"use client";

import { useEffect, useState } from "react";
import JpWord from "@/components/JpWord";
import { useSettings } from "@/components/SettingsProvider";
import { awardPoints } from "@/app/(app)/settings-actions";
import { speak } from "@/lib/speak";
import type { Sentence, SentenceToken } from "@/data/sentences";

interface Piece {
  id: number;
  token: SentenceToken;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SentenceBuilder({
  sentences,
}: {
  sentences: Sentence[];
}) {
  const { showRomaji } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [bank, setBank] = useState<Piece[]>([]);
  const [built, setBuilt] = useState<Piece[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing"
  );
  const [score, setScore] = useState(0);

  function newRound(s: Sentence) {
    const pieces = s.tokens.map((token, id) => ({ id, token }));
    setSentence(s);
    setBank(shuffle(pieces));
    setBuilt([]);
    setStatus("playing");
  }

  function next() {
    newRound(pick(sentences));
  }

  useEffect(() => {
    // Init único no cliente (evita divergência de hidratação com o sorteio).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    newRound(pick(sentences));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function place(p: Piece) {
    if (status === "correct" || !sentence) return;
    const nextBuilt = [...built, p];
    setBank((cur) => cur.filter((x) => x.id !== p.id));
    setBuilt(nextBuilt);
    if (nextBuilt.length === sentence.tokens.length) {
      const ok = nextBuilt.every((b, i) => b.id === i);
      if (ok) {
        setStatus("correct");
        setScore((v) => v + 1);
        awardPoints(2);
        speak(sentence.tokens.map((t) => t.kana).join(""));
      } else {
        setStatus("wrong");
      }
    } else {
      setStatus("playing");
    }
  }

  function remove(p: Piece) {
    if (status === "correct") return;
    setBuilt((cur) => cur.filter((x) => x.id !== p.id));
    setBank((cur) => [...cur, p]);
    setStatus("playing");
  }

  if (!mounted || !sentence) {
    return <div className="h-48 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 text-sm text-[var(--muted)]">Acertos: {score}</div>

      {/* Tradução (o objetivo) */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Monte esta frase
        </div>
        <p className="mt-2 text-lg font-medium">{sentence.meaning}</p>
      </div>

      {/* Linha em construção */}
      <div
        className={`mt-4 flex min-h-20 flex-wrap items-center justify-center gap-2 rounded-2xl border p-3 ${
          status === "correct"
            ? "border-green-500 bg-green-500/10"
            : status === "wrong"
            ? "border-red-500 bg-red-500/10"
            : "border-dashed border-[var(--border)]"
        }`}
      >
        {built.length === 0 && (
          <span className="text-sm text-[var(--muted)]">
            Toque nas palavras na ordem certa
          </span>
        )}
        {built.map((p) => (
          <button
            key={p.id}
            onClick={() => remove(p)}
            className="rounded-lg border border-[var(--primary)] bg-[var(--primary)]/10 px-3 py-2"
          >
            <JpWord
              kana={p.token.kana}
              kanji={p.token.kanji}
              romaji={showRomaji ? p.token.romaji : undefined}
              className="text-2xl"
              romajiClassName="text-xs"
            />
          </button>
        ))}
      </div>

      {status === "wrong" && (
        <p className="mt-2 text-center text-sm text-red-600">
          Não é essa ordem. Toque nas palavras para tirar e tente de novo.
        </p>
      )}

      {/* Banco de palavras */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {bank.map((p) => (
          <button
            key={p.id}
            onClick={() => place(p)}
            disabled={status === "correct"}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 transition hover:border-[var(--primary)] disabled:opacity-40"
          >
            <JpWord
              kana={p.token.kana}
              kanji={p.token.kanji}
              romaji={showRomaji ? p.token.romaji : undefined}
              className="text-2xl"
              romajiClassName="text-xs"
            />
          </button>
        ))}
      </div>

      {status === "correct" && (
        <div className="mt-4 text-center">
          <button
            onClick={() => speak(sentence.tokens.map((t) => t.kana).join(""))}
            className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white"
          >
            🔊 Ouvir a frase
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={next}
          className={`rounded-lg px-6 py-2.5 font-semibold ${
            status === "correct"
              ? "bg-green-600 text-white"
              : "border border-[var(--border)]"
          }`}
        >
          {status === "correct" ? "Próxima →" : "Pular"}
        </button>
      </div>
    </div>
  );
}
