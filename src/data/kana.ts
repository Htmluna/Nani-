// Dados dos silabários japoneses: hiragana e katakana.
// Cada linha reúne o kana, o romaji (leitura) e o grupo de consoante.

export type KanaKind = "hiragana" | "katakana";

export interface KanaChar {
  kana: string;
  romaji: string;
  group: string; // vogais, k, s, t, n, h, m, y, r, w, g, z, d, b, p, combos
}

// ---- HIRAGANA -------------------------------------------------------
export const hiraganaBase: KanaChar[] = [
  { kana: "あ", romaji: "a", group: "vogais" },
  { kana: "い", romaji: "i", group: "vogais" },
  { kana: "う", romaji: "u", group: "vogais" },
  { kana: "え", romaji: "e", group: "vogais" },
  { kana: "お", romaji: "o", group: "vogais" },
  { kana: "か", romaji: "ka", group: "k" },
  { kana: "き", romaji: "ki", group: "k" },
  { kana: "く", romaji: "ku", group: "k" },
  { kana: "け", romaji: "ke", group: "k" },
  { kana: "こ", romaji: "ko", group: "k" },
  { kana: "さ", romaji: "sa", group: "s" },
  { kana: "し", romaji: "shi", group: "s" },
  { kana: "す", romaji: "su", group: "s" },
  { kana: "せ", romaji: "se", group: "s" },
  { kana: "そ", romaji: "so", group: "s" },
  { kana: "た", romaji: "ta", group: "t" },
  { kana: "ち", romaji: "chi", group: "t" },
  { kana: "つ", romaji: "tsu", group: "t" },
  { kana: "て", romaji: "te", group: "t" },
  { kana: "と", romaji: "to", group: "t" },
  { kana: "な", romaji: "na", group: "n" },
  { kana: "に", romaji: "ni", group: "n" },
  { kana: "ぬ", romaji: "nu", group: "n" },
  { kana: "ね", romaji: "ne", group: "n" },
  { kana: "の", romaji: "no", group: "n" },
  { kana: "は", romaji: "ha", group: "h" },
  { kana: "ひ", romaji: "hi", group: "h" },
  { kana: "ふ", romaji: "fu", group: "h" },
  { kana: "へ", romaji: "he", group: "h" },
  { kana: "ほ", romaji: "ho", group: "h" },
  { kana: "ま", romaji: "ma", group: "m" },
  { kana: "み", romaji: "mi", group: "m" },
  { kana: "む", romaji: "mu", group: "m" },
  { kana: "め", romaji: "me", group: "m" },
  { kana: "も", romaji: "mo", group: "m" },
  { kana: "や", romaji: "ya", group: "y" },
  { kana: "ゆ", romaji: "yu", group: "y" },
  { kana: "よ", romaji: "yo", group: "y" },
  { kana: "ら", romaji: "ra", group: "r" },
  { kana: "り", romaji: "ri", group: "r" },
  { kana: "る", romaji: "ru", group: "r" },
  { kana: "れ", romaji: "re", group: "r" },
  { kana: "ろ", romaji: "ro", group: "r" },
  { kana: "わ", romaji: "wa", group: "w" },
  { kana: "を", romaji: "wo", group: "w" },
  { kana: "ん", romaji: "n", group: "w" },
];

export const hiraganaDakuten: KanaChar[] = [
  { kana: "が", romaji: "ga", group: "g" },
  { kana: "ぎ", romaji: "gi", group: "g" },
  { kana: "ぐ", romaji: "gu", group: "g" },
  { kana: "げ", romaji: "ge", group: "g" },
  { kana: "ご", romaji: "go", group: "g" },
  { kana: "ざ", romaji: "za", group: "z" },
  { kana: "じ", romaji: "ji", group: "z" },
  { kana: "ず", romaji: "zu", group: "z" },
  { kana: "ぜ", romaji: "ze", group: "z" },
  { kana: "ぞ", romaji: "zo", group: "z" },
  { kana: "だ", romaji: "da", group: "d" },
  { kana: "ぢ", romaji: "ji", group: "d" },
  { kana: "づ", romaji: "zu", group: "d" },
  { kana: "で", romaji: "de", group: "d" },
  { kana: "ど", romaji: "do", group: "d" },
  { kana: "ば", romaji: "ba", group: "b" },
  { kana: "び", romaji: "bi", group: "b" },
  { kana: "ぶ", romaji: "bu", group: "b" },
  { kana: "べ", romaji: "be", group: "b" },
  { kana: "ぼ", romaji: "bo", group: "b" },
  { kana: "ぱ", romaji: "pa", group: "p" },
  { kana: "ぴ", romaji: "pi", group: "p" },
  { kana: "ぷ", romaji: "pu", group: "p" },
  { kana: "ぺ", romaji: "pe", group: "p" },
  { kana: "ぽ", romaji: "po", group: "p" },
];

// Sílaba especial: o つ pequeno (sokuon) não tem som próprio — ele dobra a
// consoante seguinte (がっこう = ga-k-kou). Como é um つ menor, contamos ele
// junto da linha T, então palavras com っ aparecem a partir dela.
export const hiraganaSpecial: KanaChar[] = [
  { kana: "っ", romaji: "*", group: "t" },
];

export const katakanaSpecial: KanaChar[] = [
  { kana: "ッ", romaji: "*", group: "t" },
];

export const hiraganaCombo: KanaChar[] = [
  { kana: "きゃ", romaji: "kya", group: "combos" },
  { kana: "きゅ", romaji: "kyu", group: "combos" },
  { kana: "きょ", romaji: "kyo", group: "combos" },
  { kana: "しゃ", romaji: "sha", group: "combos" },
  { kana: "しゅ", romaji: "shu", group: "combos" },
  { kana: "しょ", romaji: "sho", group: "combos" },
  { kana: "ちゃ", romaji: "cha", group: "combos" },
  { kana: "ちゅ", romaji: "chu", group: "combos" },
  { kana: "ちょ", romaji: "cho", group: "combos" },
  { kana: "にゃ", romaji: "nya", group: "combos" },
  { kana: "にゅ", romaji: "nyu", group: "combos" },
  { kana: "にょ", romaji: "nyo", group: "combos" },
  { kana: "ひゃ", romaji: "hya", group: "combos" },
  { kana: "ひゅ", romaji: "hyu", group: "combos" },
  { kana: "ひょ", romaji: "hyo", group: "combos" },
  { kana: "みゃ", romaji: "mya", group: "combos" },
  { kana: "みゅ", romaji: "myu", group: "combos" },
  { kana: "みょ", romaji: "myo", group: "combos" },
  { kana: "りゃ", romaji: "rya", group: "combos" },
  { kana: "りゅ", romaji: "ryu", group: "combos" },
  { kana: "りょ", romaji: "ryo", group: "combos" },
  { kana: "ぎゃ", romaji: "gya", group: "combos" },
  { kana: "ぎゅ", romaji: "gyu", group: "combos" },
  { kana: "ぎょ", romaji: "gyo", group: "combos" },
  { kana: "じゃ", romaji: "ja", group: "combos" },
  { kana: "じゅ", romaji: "ju", group: "combos" },
  { kana: "じょ", romaji: "jo", group: "combos" },
  { kana: "びゃ", romaji: "bya", group: "combos" },
  { kana: "びゅ", romaji: "byu", group: "combos" },
  { kana: "びょ", romaji: "byo", group: "combos" },
  { kana: "ぴゃ", romaji: "pya", group: "combos" },
  { kana: "ぴゅ", romaji: "pyu", group: "combos" },
  { kana: "ぴょ", romaji: "pyo", group: "combos" },
];

// ---- KATAKANA (mesmas leituras, grafia diferente) -------------------
export const katakanaBase: KanaChar[] = [
  { kana: "ア", romaji: "a", group: "vogais" },
  { kana: "イ", romaji: "i", group: "vogais" },
  { kana: "ウ", romaji: "u", group: "vogais" },
  { kana: "エ", romaji: "e", group: "vogais" },
  { kana: "オ", romaji: "o", group: "vogais" },
  { kana: "カ", romaji: "ka", group: "k" },
  { kana: "キ", romaji: "ki", group: "k" },
  { kana: "ク", romaji: "ku", group: "k" },
  { kana: "ケ", romaji: "ke", group: "k" },
  { kana: "コ", romaji: "ko", group: "k" },
  { kana: "サ", romaji: "sa", group: "s" },
  { kana: "シ", romaji: "shi", group: "s" },
  { kana: "ス", romaji: "su", group: "s" },
  { kana: "セ", romaji: "se", group: "s" },
  { kana: "ソ", romaji: "so", group: "s" },
  { kana: "タ", romaji: "ta", group: "t" },
  { kana: "チ", romaji: "chi", group: "t" },
  { kana: "ツ", romaji: "tsu", group: "t" },
  { kana: "テ", romaji: "te", group: "t" },
  { kana: "ト", romaji: "to", group: "t" },
  { kana: "ナ", romaji: "na", group: "n" },
  { kana: "ニ", romaji: "ni", group: "n" },
  { kana: "ヌ", romaji: "nu", group: "n" },
  { kana: "ネ", romaji: "ne", group: "n" },
  { kana: "ノ", romaji: "no", group: "n" },
  { kana: "ハ", romaji: "ha", group: "h" },
  { kana: "ヒ", romaji: "hi", group: "h" },
  { kana: "フ", romaji: "fu", group: "h" },
  { kana: "ヘ", romaji: "he", group: "h" },
  { kana: "ホ", romaji: "ho", group: "h" },
  { kana: "マ", romaji: "ma", group: "m" },
  { kana: "ミ", romaji: "mi", group: "m" },
  { kana: "ム", romaji: "mu", group: "m" },
  { kana: "メ", romaji: "me", group: "m" },
  { kana: "モ", romaji: "mo", group: "m" },
  { kana: "ヤ", romaji: "ya", group: "y" },
  { kana: "ユ", romaji: "yu", group: "y" },
  { kana: "ヨ", romaji: "yo", group: "y" },
  { kana: "ラ", romaji: "ra", group: "r" },
  { kana: "リ", romaji: "ri", group: "r" },
  { kana: "ル", romaji: "ru", group: "r" },
  { kana: "レ", romaji: "re", group: "r" },
  { kana: "ロ", romaji: "ro", group: "r" },
  { kana: "ワ", romaji: "wa", group: "w" },
  { kana: "ヲ", romaji: "wo", group: "w" },
  { kana: "ン", romaji: "n", group: "w" },
];

export const katakanaDakuten: KanaChar[] = [
  { kana: "ガ", romaji: "ga", group: "g" },
  { kana: "ギ", romaji: "gi", group: "g" },
  { kana: "グ", romaji: "gu", group: "g" },
  { kana: "ゲ", romaji: "ge", group: "g" },
  { kana: "ゴ", romaji: "go", group: "g" },
  { kana: "ザ", romaji: "za", group: "z" },
  { kana: "ジ", romaji: "ji", group: "z" },
  { kana: "ズ", romaji: "zu", group: "z" },
  { kana: "ゼ", romaji: "ze", group: "z" },
  { kana: "ゾ", romaji: "zo", group: "z" },
  { kana: "ダ", romaji: "da", group: "d" },
  { kana: "ヂ", romaji: "ji", group: "d" },
  { kana: "ヅ", romaji: "zu", group: "d" },
  { kana: "デ", romaji: "de", group: "d" },
  { kana: "ド", romaji: "do", group: "d" },
  { kana: "バ", romaji: "ba", group: "b" },
  { kana: "ビ", romaji: "bi", group: "b" },
  { kana: "ブ", romaji: "bu", group: "b" },
  { kana: "ベ", romaji: "be", group: "b" },
  { kana: "ボ", romaji: "bo", group: "b" },
  { kana: "パ", romaji: "pa", group: "p" },
  { kana: "ピ", romaji: "pi", group: "p" },
  { kana: "プ", romaji: "pu", group: "p" },
  { kana: "ペ", romaji: "pe", group: "p" },
  { kana: "ポ", romaji: "po", group: "p" },
];

export const katakanaCombo: KanaChar[] = [
  { kana: "キャ", romaji: "kya", group: "combos" },
  { kana: "キュ", romaji: "kyu", group: "combos" },
  { kana: "キョ", romaji: "kyo", group: "combos" },
  { kana: "シャ", romaji: "sha", group: "combos" },
  { kana: "シュ", romaji: "shu", group: "combos" },
  { kana: "ショ", romaji: "sho", group: "combos" },
  { kana: "チャ", romaji: "cha", group: "combos" },
  { kana: "チュ", romaji: "chu", group: "combos" },
  { kana: "チョ", romaji: "cho", group: "combos" },
  { kana: "ニャ", romaji: "nya", group: "combos" },
  { kana: "ニュ", romaji: "nyu", group: "combos" },
  { kana: "ニョ", romaji: "nyo", group: "combos" },
  { kana: "ヒャ", romaji: "hya", group: "combos" },
  { kana: "ヒュ", romaji: "hyu", group: "combos" },
  { kana: "ヒョ", romaji: "hyo", group: "combos" },
  { kana: "ミャ", romaji: "mya", group: "combos" },
  { kana: "ミュ", romaji: "myu", group: "combos" },
  { kana: "ミョ", romaji: "myo", group: "combos" },
  { kana: "リャ", romaji: "rya", group: "combos" },
  { kana: "リュ", romaji: "ryu", group: "combos" },
  { kana: "リョ", romaji: "ryo", group: "combos" },
  { kana: "ギャ", romaji: "gya", group: "combos" },
  { kana: "ギュ", romaji: "gyu", group: "combos" },
  { kana: "ギョ", romaji: "gyo", group: "combos" },
  { kana: "ジャ", romaji: "ja", group: "combos" },
  { kana: "ジュ", romaji: "ju", group: "combos" },
  { kana: "ジョ", romaji: "jo", group: "combos" },
  { kana: "ビャ", romaji: "bya", group: "combos" },
  { kana: "ビュ", romaji: "byu", group: "combos" },
  { kana: "ビョ", romaji: "byo", group: "combos" },
  { kana: "ピャ", romaji: "pya", group: "combos" },
  { kana: "ピュ", romaji: "pyu", group: "combos" },
  { kana: "ピョ", romaji: "pyo", group: "combos" },
];

export function getKanaSet(kind: KanaKind) {
  if (kind === "hiragana") {
    return {
      base: hiraganaBase,
      dakuten: hiraganaDakuten,
      combo: hiraganaCombo,
      all: [...hiraganaBase, ...hiraganaDakuten, ...hiraganaCombo],
    };
  }
  return {
    base: katakanaBase,
    dakuten: katakanaDakuten,
    combo: katakanaCombo,
    all: [...katakanaBase, ...katakanaDakuten, ...katakanaCombo],
  };
}

export const groupLabels: Record<string, string> = {
  vogais: "Vogais",
  k: "Linha K",
  s: "Linha S",
  t: "Linha T",
  n: "Linha N",
  h: "Linha H",
  m: "Linha M",
  y: "Linha Y",
  r: "Linha R",
  w: "Linha W / N",
  g: "Linha G (dakuten)",
  z: "Linha Z (dakuten)",
  d: "Linha D (dakuten)",
  b: "Linha B (dakuten)",
  p: "Linha P (handakuten)",
  combos: "Combinações (yōon)",
};

// Ordem em que as famílias são ensinadas (método uma-por-dia).
export const familyOrder: string[] = [
  "vogais", "k", "s", "t", "n", "h", "m", "y", "r", "w",
  "g", "z", "d", "b", "p", "combos",
];

const allHiragana = [...hiraganaBase, ...hiraganaDakuten, ...hiraganaCombo];

// Primeiros kana (em hiragana) de uma família, para amostra no seletor.
export function familySample(group: string, limit = 5): string {
  return allHiragana
    .filter((c) => c.group === group)
    .slice(0, limit)
    .map((c) => c.kana)
    .join(" ");
}

// Converte uma string de hiragana para katakana (deslocamento de codepoint).
export function toKatakana(hira: string): string {
  let out = "";
  for (const ch of hira) {
    const code = ch.codePointAt(0);
    if (code !== undefined && code >= 0x3041 && code <= 0x3096) {
      out += String.fromCodePoint(code + 0x60);
    } else {
      out += ch;
    }
  }
  return out;
}
