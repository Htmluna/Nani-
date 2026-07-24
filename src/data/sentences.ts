// Frases simples para o modo "Formar frases".
// Cada frase é uma lista de tokens (palavras/partículas). O usuário recebe os
// tokens embaralhados e os coloca na ordem certa. A tradução em português e a
// leitura (furigana/romaji) ajudam quem está começando.

export interface SentenceToken {
  kana: string; // leitura em hiragana do token
  romaji: string;
  kanji?: string; // grafia em kanji, quando houver
}

export interface Sentence {
  tokens: SentenceToken[];
  meaning: string; // tradução em português
}

export const sentences: Sentence[] = [
  {
    meaning: "Isto é um guarda-chuva.",
    tokens: [
      { kana: "これ", romaji: "kore" },
      { kana: "は", romaji: "wa" },
      { kana: "かさ", romaji: "kasa", kanji: "傘" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "O céu é azul.",
    tokens: [
      { kana: "そら", romaji: "sora", kanji: "空" },
      { kana: "が", romaji: "ga" },
      { kana: "あおい", romaji: "aoi", kanji: "青い" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "Eu gosto de gatos.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      { kana: "は", romaji: "wa" },
      { kana: "ねこ", romaji: "neko", kanji: "猫" },
      { kana: "が", romaji: "ga" },
      { kana: "すき", romaji: "suki", kanji: "好き" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "O gato é fofo.",
    tokens: [
      { kana: "ねこ", romaji: "neko", kanji: "猫" },
      { kana: "は", romaji: "wa" },
      { kana: "かわいい", romaji: "kawaii" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "A montanha é alta.",
    tokens: [
      { kana: "やま", romaji: "yama", kanji: "山" },
      { kana: "が", romaji: "ga" },
      { kana: "たかい", romaji: "takai", kanji: "高い" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "Bebo água.",
    tokens: [
      { kana: "みず", romaji: "mizu", kanji: "水" },
      { kana: "を", romaji: "wo" },
      { kana: "のみます", romaji: "nomimasu", kanji: "飲みます" },
    ],
  },
  {
    meaning: "Como carne.",
    tokens: [
      { kana: "にく", romaji: "niku", kanji: "肉" },
      { kana: "を", romaji: "wo" },
      { kana: "たべます", romaji: "tabemasu", kanji: "食べます" },
    ],
  },
  {
    meaning: "Vou para a estação.",
    tokens: [
      { kana: "えき", romaji: "eki", kanji: "駅" },
      { kana: "へ", romaji: "e" },
      { kana: "いきます", romaji: "ikimasu", kanji: "行きます" },
    ],
  },
  {
    meaning: "Encontro um amigo.",
    tokens: [
      { kana: "ともだち", romaji: "tomodachi", kanji: "友達" },
      { kana: "に", romaji: "ni" },
      { kana: "あいます", romaji: "aimasu", kanji: "会います" },
    ],
  },
  {
    meaning: "Esta flor é vermelha.",
    tokens: [
      { kana: "この", romaji: "kono" },
      { kana: "はな", romaji: "hana", kanji: "花" },
      { kana: "は", romaji: "wa" },
      { kana: "あかい", romaji: "akai", kanji: "赤い" },
      { kana: "です", romaji: "desu" },
    ],
  },
  {
    meaning: "De manhã, leio um livro.",
    tokens: [
      { kana: "あさ", romaji: "asa", kanji: "朝" },
      { kana: "ほん", romaji: "hon", kanji: "本" },
      { kana: "を", romaji: "wo" },
      { kana: "よみます", romaji: "yomimasu", kanji: "読みます" },
    ],
  },
  {
    meaning: "Estudo japonês.",
    tokens: [
      { kana: "にほんご", romaji: "nihongo", kanji: "日本語" },
      { kana: "を", romaji: "wo" },
      { kana: "べんきょうします", romaji: "benkyoushimasu", kanji: "勉強します" },
    ],
  },
];
