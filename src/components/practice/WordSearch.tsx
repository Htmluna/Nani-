"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { segment, romajiOf, type Word } from "@/data/words";
import { useSettings } from "@/components/SettingsProvider";
import { awardPoints } from "@/app/(app)/settings-actions";

interface Placed {
  word: Word;
  cells: string[]; // chaves "r-c" na ordem da palavra
}

interface Grid {
  size: number;
  cells: string[][]; // kana por célula
  placed: Placed[];
}

const DIRS = [
  [0, 1], // horizontal →
  [1, 0], // vertical ↓
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(words: Word[]): Grid | null {
  // Só palavras de 2 a 5 sílabas entram na caça.
  const candidates = shuffle(
    words.filter((w) => {
      const len = segment(w.hiragana).length;
      return len >= 2 && len <= 5;
    })
  ).slice(0, 6);

  if (candidates.length < 2) return null;

  const maxLen = Math.max(...candidates.map((w) => segment(w.hiragana).length));
  const size = Math.max(8, maxLen + 1);
  const cells: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );
  const placed: Placed[] = [];

  const pool = new Set<string>();
  for (const w of words) for (const u of segment(w.hiragana)) pool.add(u.kana);
  const poolArr = [...pool];

  for (const w of candidates) {
    const units = segment(w.hiragana).map((u) => u.kana);
    let done = false;
    for (let attempt = 0; attempt < 120 && !done; attempt++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const maxR = size - (dr ? units.length : 1);
      const maxC = size - (dc ? units.length : 1);
      const r0 = Math.floor(Math.random() * (maxR + 1));
      const c0 = Math.floor(Math.random() * (maxC + 1));
      // Verifica encaixe.
      let ok = true;
      for (let i = 0; i < units.length; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        const existing = cells[r][c];
        if (existing !== "" && existing !== units[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      const coords: string[] = [];
      for (let i = 0; i < units.length; i++) {
        const r = r0 + dr * i;
        const c = c0 + dc * i;
        cells[r][c] = units[i];
        coords.push(`${r}-${c}`);
      }
      placed.push({ word: w, cells: coords });
      done = true;
    }
  }

  if (placed.length < 2) return null;

  // Preenche o resto com kana aleatório das famílias liberadas.
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (cells[r][c] === "") {
        cells[r][c] = poolArr[Math.floor(Math.random() * poolArr.length)];
      }
    }
  }

  return { size, cells, placed };
}

function sameLine(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const fwd = a.every((x, i) => x === b[i]);
  const rev = a.every((x, i) => x === b[b.length - 1 - i]);
  return fwd || rev;
}

export default function WordSearch({ words }: { words: Word[] }) {
  const { showRomaji } = useSettings();
  const [mounted, setMounted] = useState(false);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set()); // hiragana das achadas
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  // Caminho sendo montado (sílabas tocadas em sequência).
  const [sel, setSel] = useState<string[]>([]);

  function regenerate() {
    setGrid(buildGrid(words));
    setFound(new Set());
    setFoundCells(new Set());
    setSel([]);
  }

  useEffect(() => {
    // Init único no cliente: gera a grade só após montar, para evitar
    // divergência de hidratação (a geração usa aleatoriedade).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setGrid(buildGrid(words));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allFound = useMemo(
    () => grid != null && found.size === grid.placed.length,
    [grid, found]
  );

  // Monta o caminho tocando as sílabas em sequência (horizontal ou vertical).
  // Cada toque tenta estender a linha atual; se não der, recomeça na sílaba
  // tocada. Sempre que o caminho formar uma palavra da lista, ela é marcada.
  function nextSelection(prev: string[], key: string): string[] {
    if (prev.length === 0) return [key];
    if (prev.includes(key)) {
      // Tocar de novo na última desfaz; em qualquer outra já usada, recomeça.
      if (prev[prev.length - 1] === key) return prev.slice(0, -1);
      return [key];
    }
    const [lr, lc] = prev[prev.length - 1].split("-").map(Number);
    const [kr, kc] = key.split("-").map(Number);
    const dr = kr - lr;
    const dc = kc - lc;
    // Precisa ser vizinha na horizontal ou vertical (passo de 1).
    const adjacent =
      (Math.abs(dr) === 1 && dc === 0) || (Math.abs(dc) === 1 && dr === 0);
    if (!adjacent) return [key];
    if (prev.length === 1) return [...prev, key];
    // A partir da 3ª, precisa manter a mesma direção.
    const [pr, pc] = prev[0].split("-").map(Number);
    const [sr, sc] = prev[1].split("-").map(Number);
    if (Math.sign(dr) === Math.sign(sr - pr) && Math.sign(dc) === Math.sign(sc - pc)) {
      return [...prev, key];
    }
    return [key];
  }

  function tapCell(key: string) {
    if (!grid) return;
    const next = nextSelection(sel, key);
    // Verifica se o caminho atual forma alguma palavra ainda não achada.
    const match = grid.placed.find(
      (p) => !found.has(p.word.hiragana) && sameLine(next, p.cells)
    );
    if (match) {
      setFound((f) => new Set(f).add(match.word.hiragana));
      setFoundCells((fc) => {
        const n = new Set(fc);
        for (const c of match.cells) n.add(c);
        return n;
      });
      awardPoints(1);
      setSel([]);
    } else {
      setSel(next);
    }
  }

  if (!mounted) {
    return <div className="h-80 animate-pulse rounded-2xl bg-[var(--card)]" />;
  }

  if (!grid) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div className="text-4xl">🔒</div>
        <p className="mt-3 text-[var(--muted)]">
          Preciso de pelo menos 2 palavras com as famílias liberadas. Libere
          mais famílias em Praticar.
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
    <div className="mx-auto max-w-2xl">
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        {/* Grade */}
        <div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${grid.size}, minmax(0,1fr))` }}
          >
            {grid.cells.map((row, r) =>
              row.map((kana, c) => {
                const key = `${r}-${c}`;
                const isFound = foundCells.has(key);
                const isSel = sel.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => tapCell(key)}
                    className={`jp flex aspect-square items-center justify-center rounded-md border text-base transition sm:text-xl ${
                      isFound
                        ? "border-green-500 bg-green-500/20 font-semibold"
                        : isSel
                        ? "border-[var(--primary)] bg-[var(--primary)]/20 font-semibold"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {kana}
                  </button>
                );
              })
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Toque nas sílabas em sequência (na horizontal ou vertical) para
            formar a palavra. Toque na última de novo para desfazer.
          </p>
        </div>

        {/* Lista de palavras */}
        <aside className="md:w-56">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Encontre ({found.size}/{grid.placed.length})
          </h3>
          <ul className="space-y-1">
            {grid.placed.map((p) => {
              const done = found.has(p.word.hiragana);
              return (
                <li
                  key={p.word.hiragana}
                  className={`flex items-baseline justify-between gap-2 rounded-lg border px-3 py-1.5 ${
                    done
                      ? "border-green-500 bg-green-500/10"
                      : "border-[var(--border)] bg-[var(--card)]"
                  }`}
                >
                  <span>
                    <span
                      className={`jp text-lg ${done ? "" : ""}`}
                    >
                      {p.word.hiragana}
                    </span>
                    {showRomaji && (
                      <span className="ml-1 text-xs text-[var(--muted)]">
                        {romajiOf(p.word.hiragana)}
                      </span>
                    )}
                    <span className="block text-xs text-[var(--muted)]">
                      {p.word.meaning}
                    </span>
                  </span>
                  {done && <span className="text-green-600">✓</span>}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {allFound && (
        <div className="mt-5 rounded-2xl border border-green-500 bg-green-500/10 p-5 text-center">
          <div className="text-3xl">🎉</div>
          <p className="mt-1 font-semibold">Achou todas!</p>
        </div>
      )}

      <div className="mt-5 text-center">
        <button
          onClick={regenerate}
          className="rounded-lg bg-[var(--primary)] px-6 py-2.5 font-semibold text-[var(--primary-foreground)]"
        >
          {allFound ? "Nova caça-palavras" : "Embaralhar de novo"}
        </button>
      </div>
    </div>
  );
}
