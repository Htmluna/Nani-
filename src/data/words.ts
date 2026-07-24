// Banco de palavras simples para as atividades de prática.
// Cada palavra é escrita em hiragana; o romaji, os "azulejos" de kana e as
// famílias usadas são derivados automaticamente a partir dos dados de kana.ts.
// Assim, para liberar uma palavra numa atividade, basta que todas as famílias
// dela já tenham sido ensinadas.

import { hiraganaBase, hiraganaDakuten, hiraganaCombo } from "./kana";

export interface Word {
  hiragana: string;
  meaning: string; // significado em português
  kanji?: string; // grafia em kanji, quando natural
}

export interface KanaUnit {
  kana: string; // uma sílaba em hiragana (pode ser um yōon de 2 caracteres)
  romaji: string;
  group: string; // família (chave de grupo)
}

// Mapa sílaba (hiragana) -> { romaji, group }.
const unitMap = new Map<string, { romaji: string; group: string }>();
for (const c of [...hiraganaBase, ...hiraganaDakuten, ...hiraganaCombo]) {
  unitMap.set(c.kana, { romaji: c.romaji, group: c.group });
}

// Quebra uma palavra em hiragana nas suas sílabas (yōon contam como uma).
export function segment(hira: string): KanaUnit[] {
  const out: KanaUnit[] = [];
  let i = 0;
  while (i < hira.length) {
    const two = hira.slice(i, i + 2);
    const u2 = unitMap.get(two);
    if (u2) {
      out.push({ kana: two, ...u2 });
      i += 2;
      continue;
    }
    const one = hira.slice(i, i + 1);
    const u1 = unitMap.get(one);
    if (u1) {
      out.push({ kana: one, ...u1 });
      i += 1;
      continue;
    }
    // Caractere desconhecido (não deveria acontecer com este banco).
    out.push({ kana: one, romaji: "", group: "?" });
    i += 1;
  }
  return out;
}

export function romajiOf(hira: string): string {
  return segment(hira)
    .map((u) => u.romaji)
    .join("");
}

export function groupsOf(hira: string): string[] {
  return [...new Set(segment(hira).map((u) => u.group))];
}

// ---- BANCO DE PALAVRAS ----------------------------------------------
// Ordenadas por família para acompanhar o método (vogais → k → s → ...).
export const words: Word[] = [
  // vogais
  { hiragana: "あい", meaning: "amor", kanji: "愛" },
  { hiragana: "あお", meaning: "azul", kanji: "青" },
  { hiragana: "いえ", meaning: "casa", kanji: "家" },
  { hiragana: "うえ", meaning: "em cima", kanji: "上" },
  { hiragana: "え", meaning: "desenho, quadro", kanji: "絵" },
  { hiragana: "あう", meaning: "encontrar(-se)", kanji: "会う" },
  // + linha K
  { hiragana: "あき", meaning: "outono", kanji: "秋" },
  { hiragana: "かお", meaning: "rosto", kanji: "顔" },
  { hiragana: "かき", meaning: "caqui", kanji: "柿" },
  { hiragana: "きく", meaning: "ouvir", kanji: "聞く" },
  { hiragana: "こえ", meaning: "voz", kanji: "声" },
  { hiragana: "ここ", meaning: "aqui" },
  { hiragana: "いけ", meaning: "lago", kanji: "池" },
  { hiragana: "えき", meaning: "estação (trem)", kanji: "駅" },
  { hiragana: "あか", meaning: "vermelho", kanji: "赤" },
  { hiragana: "かく", meaning: "escrever", kanji: "書く" },
  // + linha S
  { hiragana: "かさ", meaning: "guarda-chuva", kanji: "傘" },
  { hiragana: "あさ", meaning: "manhã", kanji: "朝" },
  { hiragana: "すし", meaning: "sushi", kanji: "寿司" },
  { hiragana: "せき", meaning: "assento", kanji: "席" },
  { hiragana: "しか", meaning: "veado", kanji: "鹿" },
  { hiragana: "さけ", meaning: "saquê", kanji: "酒" },
  { hiragana: "あし", meaning: "pé, perna", kanji: "足" },
  { hiragana: "うそ", meaning: "mentira", kanji: "嘘" },
  // + linha T
  { hiragana: "たこ", meaning: "polvo", kanji: "蛸" },
  { hiragana: "くつ", meaning: "sapato", kanji: "靴" },
  { hiragana: "て", meaning: "mão", kanji: "手" },
  { hiragana: "した", meaning: "embaixo", kanji: "下" },
  { hiragana: "つき", meaning: "lua", kanji: "月" },
  { hiragana: "とし", meaning: "ano, idade", kanji: "年" },
  // + linha N
  { hiragana: "ねこ", meaning: "gato", kanji: "猫" },
  { hiragana: "いぬ", meaning: "cachorro", kanji: "犬" },
  { hiragana: "なに", meaning: "o quê", kanji: "何" },
  { hiragana: "にく", meaning: "carne", kanji: "肉" },
  { hiragana: "なつ", meaning: "verão", kanji: "夏" },
  { hiragana: "なな", meaning: "sete", kanji: "七" },
  // + linha H
  { hiragana: "はな", meaning: "flor", kanji: "花" },
  { hiragana: "ほし", meaning: "estrela", kanji: "星" },
  { hiragana: "ふね", meaning: "barco", kanji: "船" },
  { hiragana: "はこ", meaning: "caixa", kanji: "箱" },
  { hiragana: "ひと", meaning: "pessoa", kanji: "人" },
  // + linha M
  { hiragana: "みみ", meaning: "orelha", kanji: "耳" },
  { hiragana: "め", meaning: "olho", kanji: "目" },
  { hiragana: "まめ", meaning: "feijão", kanji: "豆" },
  { hiragana: "みせ", meaning: "loja", kanji: "店" },
  { hiragana: "くも", meaning: "nuvem", kanji: "雲" },
  { hiragana: "みち", meaning: "caminho", kanji: "道" },
  // + linha Y
  { hiragana: "やま", meaning: "montanha", kanji: "山" },
  { hiragana: "ゆき", meaning: "neve", kanji: "雪" },
  { hiragana: "やさい", meaning: "verdura, legume", kanji: "野菜" },
  // + linha R
  { hiragana: "そら", meaning: "céu", kanji: "空" },
  { hiragana: "とり", meaning: "pássaro", kanji: "鳥" },
  { hiragana: "くるま", meaning: "carro", kanji: "車" },
  { hiragana: "はる", meaning: "primavera", kanji: "春" },
  { hiragana: "しろ", meaning: "branco", kanji: "白" },
  { hiragana: "よる", meaning: "noite", kanji: "夜" },
  // + linha W / N
  { hiragana: "かわ", meaning: "rio", kanji: "川" },
  { hiragana: "わたし", meaning: "eu", kanji: "私" },
  // + dakuten (g / z / d / b) e handakuten (p)
  { hiragana: "みず", meaning: "água", kanji: "水" },
  { hiragana: "かぎ", meaning: "chave", kanji: "鍵" },
  { hiragana: "たまご", meaning: "ovo", kanji: "卵" },
  { hiragana: "めがね", meaning: "óculos", kanji: "眼鏡" },
  { hiragana: "ぶた", meaning: "porco", kanji: "豚" },
  { hiragana: "かばん", meaning: "bolsa", kanji: "鞄" },
  { hiragana: "でんわ", meaning: "telefone", kanji: "電話" },
  { hiragana: "さんぽ", meaning: "passeio, caminhada", kanji: "散歩" },
];

// Palavras cujas famílias já foram todas ensinadas.
export function wordsForGroups(taught: string[]): Word[] {
  const set = new Set(taught);
  return words.filter((w) => groupsOf(w.hiragana).every((g) => set.has(g)));
}
