"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { romajiOf, wordsForGroups, type Word } from "@/data/words";
import { useSettings } from "@/components/SettingsProvider";
import { awardPoints } from "@/app/(app)/settings-actions";
import { speak } from "@/lib/speak";
import { shuffle, useShuffledDraw } from "@/lib/shuffle";

// Três tipos de pergunta, sorteados a cada rodada — a mesma palavra pode voltar
// depois com uma pergunta diferente, então o quiz não fica previsível.
type Kind = "meaning" | "reading" | "writing";

interface Round {
  kind: Kind;
  word: Word;
  options: string[]; // textos das alternativas
  answer: string; // alternativa correta
}

const OPTIONS = 4;
const KINDS: Kind[] = ["meaning", "reading", "writing"];

const PROMPTS: Record<Kind, string> = {
  meaning: "O que esta palavra significa?",
  reading: "Como se lê esta palavra?",
  writing: "Como se escreve esta palavra?",
};

// Texto de cada alternativa, conforme o tipo de pergunta.
function optionOf(kind: Kind, w: Word): string {
  if (kind === "meaning") return w.meaning;
  if (kind === "reading") return romajiOf(w.hiragana);
  return w.hiragana;
}

export default function MeaningQuiz() {
  const { showRomaji, showFurigana, taughtGroups } = useSettings();
  const words = useMemo(() => wordsForGroups(taughtGroups), [taughtGroups]);
  const { draw, reset } = useShuffledDraw(words);
  const [mounted, setMounted] = useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState(0);

  const newRound = useCallback(
    (w: Word) => {
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
      const answer = optionOf(kind, w);
      // Distratores: outras palavras liberadas, sem repetir o texto da resposta.
      const seen = new Set([answer]);
      const distractors: string[] = [];
      for (const other of shuffle(words)) {
        if (distractors.length >= OPTIONS - 1) break;
        if (other.hiragana === w.hiragana) continue;
        const text = optionOf(kind, other);
        if (seen.has(text)) continue;
        seen.add(text);
        distractors.push(text);
      }
      setRound({
        kind,
        word: w,
        answer,
        options: shuffle([answer, ...distractors]),
      });
      setChosen(null);
      if (kind !== "writing") speak(w.hiragana);
    },
    [words]
  );

  const next = useCallback(() => {
    const w = draw();
    if (w) newRound(w);
  }, [draw, newRound]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    reset();
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  function choose(option: string) {
    if (chosen || !round) return;
    setChosen(option);
    setAsked((n) => n + 1);
    if (option === round.answer) {
      setScore((s) => s + 1);
      awardPoints(1);
      speak(round.word.hiragana);
    }
  }

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  if (words.length < OPTIONS || !round) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="text-4xl">🔒</div>
        <p className="mt-3 text-[var(--muted)]">
          O quiz precisa de pelo menos {OPTIONS} palavras liberadas. Libere mais
          famílias em Praticar.
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

  const { kind, word } = round;
  const done = chosen !== null;
  const right = done && chosen === round.answer;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 flex items-center justify-between text-sm text-[var(--muted)]">
        <span>
          Acertos: {score}
          {asked > 0 && ` de ${asked}`}
        </span>
        <span>{words.length} palavras no baralho</span>
      </div>

      {/* Enunciado */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {PROMPTS[kind]}
        </div>

        {kind === "writing" ? (
          // Vai do português para o japonês: mostra só o significado.
          <p className="mt-3 text-2xl font-semibold">{word.meaning}</p>
        ) : (
          <>
            <div className="jp mt-3 text-6xl leading-none">
              {word.kanji && showFurigana ? (
                <ruby>
                  {word.kanji}
                  <rt className="jp text-[0.4em] font-normal text-[var(--muted)]">
                    {word.hiragana}
                  </rt>
                </ruby>
              ) : (
                word.kanji ?? word.hiragana
              )}
            </div>
            {/* Sem furigana o kanji fica sozinho: a leitura em kana é a graça
                da pergunta, então só mostramos o hiragana quando não é ele o
                que está sendo perguntado. */}
            {kind === "meaning" && !showFurigana && word.kanji && (
              <p className="jp mt-2 text-xl text-[var(--muted)]">
                {word.hiragana}
              </p>
            )}
            <button
              onClick={() => speak(word.hiragana)}
              className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-sm font-semibold text-white"
            >
              🔊 Ouvir
            </button>
          </>
        )}
      </div>

      {/* Alternativas */}
      <div className="mt-4 grid gap-2">
        {round.options.map((opt) => {
          const isAnswer = opt === round.answer;
          const isChosen = opt === chosen;
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={done}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                done && isAnswer
                  ? "border-green-500 bg-green-500/10 font-semibold"
                  : done && isChosen
                  ? "border-red-500 bg-red-500/10"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]"
              } ${done && !isAnswer && !isChosen ? "opacity-50" : ""}`}
            >
              <span className={kind === "writing" ? "jp text-2xl" : "text-lg"}>
                {opt}
              </span>
              {kind === "writing" && showRomaji && (
                <span className="ml-2 text-sm text-[var(--muted)]">
                  {romajiOf(opt)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {done && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
          <p className={right ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
            {right ? "Acertou! 🎉" : "Não foi essa."}
          </p>
          <p className="mt-2">
            <span className="jp text-2xl">{word.kanji ?? word.hiragana}</span>
            <span className="jp ml-2 text-lg text-[var(--muted)]">
              {word.hiragana}
            </span>
            {showRomaji && (
              <span className="ml-2 text-sm text-[var(--muted)]">
                {romajiOf(word.hiragana)}
              </span>
            )}
          </p>
          <p className="text-sm text-[var(--muted)]">{word.meaning}</p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={next}
          className={`rounded-lg px-6 py-2.5 font-semibold ${
            done
              ? "bg-green-600 text-white"
              : "border border-[var(--border)]"
          }`}
        >
          {done ? "Próxima →" : "Pular"}
        </button>
      </div>
    </div>
  );
}
