import { getKanaSet } from "./kana";
import { jlptVocab, jlptLevels, type JlptLevel } from "./jlpt";

export interface Card {
  id: string; // estável, ex.: "kana:hiragana:あ" ou "jlpt:N5:水"
  front: string;
  back: string;
  sub?: string; // linha extra no verso (ex.: significado)
  jp?: boolean; // usa fonte japonesa maior na frente
}

export interface Deck {
  slug: string;
  name: string;
  description: string;
  sample: string;
  cards: Card[];
}

export function buildDeck(slug: string): Deck | null {
  if (slug === "hiragana" || slug === "katakana") {
    const set = getKanaSet(slug);
    return {
      slug,
      name: slug === "hiragana" ? "Hiragana" : "Katakana",
      description: "Veja o kana e lembre a leitura (romaji).",
      sample: set.base
        .slice(0, 5)
        .map((c) => c.kana)
        .join(""),
      cards: set.all.map((c) => ({
        id: `kana:${slug}:${c.kana}`,
        front: c.kana,
        back: c.romaji,
        jp: true,
      })),
    };
  }

  if (slug.startsWith("jlpt-")) {
    const level = slug.replace("jlpt-", "") as JlptLevel;
    if (!jlptLevels.includes(level)) return null;
    const vocab = jlptVocab[level];
    return {
      slug,
      name: `Vocabulário ${level}`,
      description: "Veja a palavra e lembre a leitura e o significado.",
      sample: vocab
        .slice(0, 3)
        .map((v) => v.word)
        .join(" "),
      cards: vocab.map((v) => ({
        id: `jlpt:${level}:${v.word}`,
        front: v.word,
        back: v.reading,
        sub: v.meaning,
        jp: true,
      })),
    };
  }

  return null;
}

export const deckList = [
  { slug: "hiragana", name: "Hiragana", sample: "あいうえお" },
  { slug: "katakana", name: "Katakana", sample: "アイウエオ" },
  ...jlptLevels.map((l) => ({
    slug: `jlpt-${l}`,
    name: `Vocabulário ${l}`,
    sample: jlptVocab[l][0]?.word ?? l,
  })),
];
