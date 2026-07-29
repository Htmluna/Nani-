"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { segment, romajiOf, wordsForGroups, type Word } from "@/data/words";
import { useSettings } from "@/components/SettingsProvider";
import { awardPoints } from "@/app/(app)/settings-actions";
import { speak } from "@/lib/speak";
import { shuffle, useShuffledDraw } from "@/lib/shuffle";

interface Tile {
  id: number;
  kana: string;
}

export default function Dictation() {
  const { showRomaji, taughtGroups } = useSettings();
  const words = useMemo(() => wordsForGroups(taughtGroups), [taughtGroups]);
  const { draw, reset } = useShuffledDraw(words);
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState<Word | null>(null);
  const [built, setBuilt] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing"
  );
  const [hint, setHint] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);

  const pool = useMemo(() => {
    const set = new Set<string>();
    for (const w of words) for (const u of segment(w.hiragana)) set.add(u.kana);
    return [...set];
  }, [words]);

  const newRound = useCallback(
    (w: Word) => {
      const units = segment(w.hiragana).map((u) => u.kana);
      const distractors = shuffle(pool.filter((k) => !units.includes(k))).slice(
        0,
        Math.min(4, Math.max(2, pool.length - units.length))
      );
      setWord(w);
      setBuilt([]);
      setTiles(
        shuffle([...units, ...distractors]).map((kana, i) => ({ id: i, kana }))
      );
      setStatus("playing");
      setHint(false);
      setReveal(false);
      speak(w.hiragana);
    },
    [pool]
  );

  // A fila embaralhada garante passar por todas as palavras antes de repetir.
  const next = useCallback(() => {
    const w = draw();
    if (w) newRound(w);
  }, [draw, newRound]);

  useEffect(() => {
    // Init no cliente (evita divergência de hidratação com o sorteio) e
    // recomeço quando as famílias liberadas mudam.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    reset();
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  function placeTile(t: Tile) {
    if (status === "correct" || !word) return;
    const nextBuilt = [...built, t];
    setTiles((cur) => cur.filter((x) => x.id !== t.id));
    setBuilt(nextBuilt);
    const target = segment(word.hiragana).map((u) => u.kana);
    if (nextBuilt.length === target.length) {
      const ok = nextBuilt.every((b, i) => b.kana === target[i]);
      if (ok) {
        setStatus("correct");
        setScore((s) => s + 1);
        awardPoints(1);
        speak(word.hiragana);
      } else {
        setStatus("wrong");
      }
    } else {
      setStatus("playing");
    }
  }

  function removeBuilt(t: Tile) {
    if (status === "correct") return;
    setBuilt((cur) => cur.filter((x) => x.id !== t.id));
    setTiles((cur) => [...cur, t]);
    setStatus("playing");
  }

  if (!mounted) {
    return <div className="h-40 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  if (words.length === 0 || !word) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="text-4xl">🔒</div>
        <p className="mt-3 text-[var(--muted)]">
          Libere mais famílias em Praticar para desbloquear o ditado.
        </p>
        <Link
          href="/praticar"
          className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-5 py-2.5 font-semibold text-[var(--primary-foreground)]"
        >
          Escolher famílias
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 text-sm text-[var(--muted)]">Acertos: {score}</div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="text-5xl">🎧</div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ouça e monte a palavra com as sílabas certas.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => speak(word.hiragana)}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            🔊 Ouvir de novo
          </button>
          <button
            onClick={() => setHint((h) => !h)}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            💡 Dica
          </button>
        </div>
        {hint && (
          <p className="mt-3 text-lg font-medium">{word.meaning}</p>
        )}
      </div>

      {/* Montagem */}
      <div
        className={`mt-4 flex min-h-16 flex-wrap items-center justify-center gap-2 rounded-2xl border p-3 ${
          status === "correct"
            ? "border-green-500 bg-green-500/10"
            : status === "wrong"
            ? "border-red-500 bg-red-500/10"
            : "border-dashed border-[var(--border)]"
        }`}
      >
        {built.length === 0 && (
          <span className="text-sm text-[var(--muted)]">Suas sílabas aqui</span>
        )}
        {built.map((t) => (
          <button
            key={t.id}
            onClick={() => removeBuilt(t)}
            className="jp rounded-lg border border-[var(--primary)] bg-[var(--primary)]/10 px-3 py-2 text-2xl"
          >
            {t.kana}
          </button>
        ))}
      </div>

      {(status === "correct" || reveal) && (
        <div className="mt-3 text-center">
          <span className="jp text-2xl font-semibold">{word.hiragana}</span>
          {showRomaji && (
            <span className="ml-2 text-[var(--muted)]">
              {romajiOf(word.hiragana)}
            </span>
          )}
          <span className="ml-2 text-[var(--muted)]">— {word.meaning}</span>
        </div>
      )}

      {/* Banco */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tiles.map((t) => (
          <button
            key={t.id}
            onClick={() => placeTile(t)}
            disabled={status === "correct"}
            className="jp rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-2xl transition hover:border-[var(--primary)] disabled:opacity-40"
          >
            {t.kana}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        {!reveal && status !== "correct" && (
          <button
            onClick={() => setReveal(true)}
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"
          >
            Mostrar resposta
          </button>
        )}
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
