// Vocabulário JLPT completo (listas da comunidade, ~8.100 palavras N5–N1).
// Fonte: github.com/jamsinclair/open-anki-jlpt-decks (baseado nas listas
// oficiais pré-2010 do tanos.co.uk). Significados em inglês.
// Os dados ficam em src/data/jlpt/N5.json ... N1.json.

import N5 from "./jlpt/N5.json";
import N4 from "./jlpt/N4.json";
import N3 from "./jlpt/N3.json";
import N2 from "./jlpt/N2.json";
import N1 from "./jlpt/N1.json";

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface VocabItem {
  word: string; // como se escreve (kanji/kana)
  reading: string; // leitura em hiragana/katakana
  meaning: string; // significado (em inglês)
}

export const jlptLevels: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export const jlptDescriptions: Record<JlptLevel, string> = {
  N5: "Iniciante — frases básicas do dia a dia, hiragana, katakana e ~100 kanji.",
  N4: "Básico — conversas simples e cerca de 300 kanji.",
  N3: "Intermediário — ponte entre o básico e o avançado, ~650 kanji.",
  N2: "Intermediário-avançado — jornais e conversas do cotidiano, ~1000 kanji.",
  N1: "Avançado — compreensão ampla de textos complexos e abstratos, ~2000 kanji.",
};

export const jlptVocab: Record<JlptLevel, VocabItem[]> = {
  N5: N5 as VocabItem[],
  N4: N4 as VocabItem[],
  N3: N3 as VocabItem[],
  N2: N2 as VocabItem[],
  N1: N1 as VocabItem[],
};

export const jlptCounts: Record<JlptLevel, number> = {
  N5: jlptVocab.N5.length,
  N4: jlptVocab.N4.length,
  N3: jlptVocab.N3.length,
  N2: jlptVocab.N2.length,
  N1: jlptVocab.N1.length,
};
