"use client";

import { useCallback, useEffect, useRef } from "react";

// Embaralhamento Fisher-Yates (aleatório de verdade).
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sorteia itens SEM repetir: percorre a lista embaralhada até o fim antes de
 * dar a volta. Ao reembaralhar, evita que o último item sorteado caia de novo
 * em primeiro (senão ele apareceria duas vezes seguidas na virada).
 *
 * `draw()` devolve o próximo item (ou null se a lista estiver vazia) e
 * `reset()` joga a rodada atual fora — use quando a lista de itens mudar.
 */
export function useShuffledDraw<T>(items: T[]) {
  const poolRef = useRef(items);
  const restRef = useRef<T[]>([]);
  const lastRef = useRef<T | null>(null);

  // Sincroniza a lista fora da renderização. Este efeito é declarado antes dos
  // efeitos de quem usa o hook, então o pool já está atualizado quando o
  // componente chama draw() por causa de uma lista nova.
  useEffect(() => {
    poolRef.current = items;
  }, [items]);

  const reset = useCallback(() => {
    restRef.current = [];
    lastRef.current = null;
  }, []);

  const draw = useCallback((): T | null => {
    const pool = poolRef.current;
    if (pool.length === 0) return null;
    if (restRef.current.length === 0) {
      const deck = shuffle(pool);
      if (deck.length > 2 && deck[0] === lastRef.current) {
        const j = 1 + Math.floor(Math.random() * (deck.length - 1));
        [deck[0], deck[j]] = [deck[j], deck[0]];
      }
      restRef.current = deck;
    }
    const item = restRef.current.shift() ?? null;
    lastRef.current = item;
    return item;
  }, []);

  // Sorteia vários itens distintos de uma vez (ex.: palavras de uma grade).
  const drawMany = useCallback(
    (n: number): T[] => {
      const out: T[] = [];
      const max = Math.min(n, poolRef.current.length);
      const seen = new Set<T>();
      let guard = 0;
      while (out.length < max && guard++ < max * 4) {
        const item = draw();
        if (item === null) break;
        if (seen.has(item)) continue;
        seen.add(item);
        out.push(item);
      }
      return out;
    },
    [draw]
  );

  return { draw, drawMany, reset };
}
