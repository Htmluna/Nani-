"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { segment, romajiOf, wordsForGroups, type Word } from "@/data/words";
import { toKatakana } from "@/data/kana";
import { useSettings } from "@/components/SettingsProvider";
import { awardPoints } from "@/app/(app)/settings-actions";
import { speak } from "@/lib/speak";
import { shuffle, useShuffledDraw } from "@/lib/shuffle";

type Script = "kanji" | "hiragana" | "katakana";

interface Tile {
  id: number;
  kana: string; // no silabário atual (hira ou kata)
  base: string; // sempre em hiragana (para comparação)
}

function toScript(kanaHira: string, s: Script): string {
  return s === "katakana" ? toKatakana(kanaHira) : kanaHira;
}

export default function ComposeWord() {
  const { showRomaji, taughtGroups } = useSettings();
  // As palavras vêm do progresso salvo no contexto, então mudar as famílias
  // liberadas troca o material na hora.
  const words = useMemo(() => wordsForGroups(taughtGroups), [taughtGroups]);
  const { draw, reset } = useShuffledDraw(words);
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState<Word | null>(null);
  const [script, setScript] = useState<Script>("hiragana");
  const [built, setBuilt] = useState<Tile[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing"
  );
  const [score, setScore] = useState(0);

  // Todas as sílabas (hiragana) que aparecem nas palavras liberadas —
  // servem de "distratores" no banco de peças.
  const pool = useMemo(() => {
    const set = new Set<string>();
    for (const w of words) for (const u of segment(w.hiragana)) set.add(u.kana);
    return [...set];
  }, [words]);

  const newRound = useCallback((w: Word, s: Script) => {
    const units = segment(w.hiragana).map((u) => u.kana);
    const distractors = shuffle(pool.filter((k) => !units.includes(k))).slice(
      0,
      Math.min(4, Math.max(2, pool.length - units.length))
    );
    const tileSyllabary: Script = s === "katakana" ? "katakana" : "hiragana";
    const bank: Tile[] = shuffle([...units, ...distractors]).map((base, i) => ({
      id: i,
      base,
      kana: toScript(base, tileSyllabary),
    }));
    setWord(w);
    setScript(s);
    setBuilt([]);
    setTiles(bank);
    setStatus("playing");
  }, [pool]);

  // Próxima palavra: a fila embaralhada passa por todas antes de repetir.
  // Cada palavra começa no script que ela tiver (prioriza kanji se houver).
  const next = useCallback(
    (withAudio = true) => {
      const w = draw();
      if (!w) return;
      newRound(w, w.kanji ? "kanji" : "hiragana");
      if (withAudio) speak(w.hiragana);
    },
    [draw, newRound]
  );

  useEffect(() => {
    // Sorteia a 1ª rodada só depois de montar (o sorteio é aleatório e
    // divergiria da renderização do servidor). Recomeça também quando as
    // famílias liberadas mudam.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    reset();
    next(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  function placeTile(t: Tile) {
    if (status !== "playing" || !word) return;
    const nextBuilt = [...built, t];
    setTiles((cur) => cur.filter((x) => x.id !== t.id));
    setBuilt(nextBuilt);
    // Verifica quando completar o comprimento da palavra.
    const target = segment(word.hiragana).map((u) => u.kana);
    if (nextBuilt.length === target.length) {
      const ok = nextBuilt.every((b, i) => b.base === target[i]);
      if (ok) {
        setStatus("correct");
        setScore((s) => s + 1);
        awardPoints(1);
        speak(word.hiragana);
      } else {
        setStatus("wrong");
      }
    }
  }

  function removeBuilt(t: Tile) {
    if (status === "correct") return;
    setBuilt((cur) => cur.filter((x) => x.id !== t.id));
    setTiles((cur) => [...cur, t]);
    setStatus("playing");
  }

  function switchScript(s: Script) {
    if (word) newRound(word, s);
  }

  if (!mounted) {
    return <div className="h-40 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  if (words.length === 0 || !word) {
    return <EmptyState />;
  }

  const target = segment(word.hiragana).map((u) => u.kana);
  const display =
    script === "kanji" && word.kanji
      ? word.kanji
      : target.map((k) => toScript(k, script)).join("");

  const availableScripts: Script[] = word.kanji
    ? ["kanji", "hiragana", "katakana"]
    : ["hiragana", "katakana"];

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>Acertos: {score}</span>
        <div className="flex gap-1">
          {availableScripts.map((s) => (
            <button
              key={s}
              onClick={() => switchScript(s)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                script === s
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border border-[var(--border)] hover:bg-[var(--background)]"
              }`}
            >
              {s === "kanji" ? "Kanji" : s === "hiragana" ? "Hiragana" : "Katakana"}
            </button>
          ))}
        </div>
      </div>

      {/* Palavra alvo */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="jp text-6xl leading-none">{display}</div>
        <p className="mt-3 text-lg font-medium">{word.meaning}</p>
        {showRomaji && (
          <p className="mt-1 text-sm text-[var(--muted)]">
            {romajiOf(word.hiragana)}
          </p>
        )}
        <button
          onClick={() => speak(word.hiragana)}
          className="mt-3 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white"
        >
          🔊 Ouvir
        </button>
      </div>

      {/* Área de montagem */}
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
          <span className="text-sm text-[var(--muted)]">
            Toque nas sílabas na ordem certa
          </span>
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

      {status === "wrong" && (
        <p className="mt-2 text-center text-sm text-red-600">
          Ops! Toque nas peças para tirar e tente de novo. Resposta:{" "}
          <span className="jp font-semibold">
            {target.map((k) => toScript(k, script === "kanji" ? "hiragana" : script)).join("")}
          </span>
        </p>
      )}

      {/* Banco de peças */}
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
        {status === "correct" ? (
          <button
            onClick={() => next()}
            className="rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white"
          >
            Próxima →
          </button>
        ) : (
          <button
            onClick={() => next()}
            className="rounded-lg border border-[var(--border)] px-6 py-2.5 font-semibold"
          >
            Pular
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
      <div className="text-4xl">🔒</div>
      <p className="mt-3 text-[var(--muted)]">
        Ainda não há palavras suficientes com as famílias liberadas. Libere mais
        famílias para desbloquear atividades.
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
