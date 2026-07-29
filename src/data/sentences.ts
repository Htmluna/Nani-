// Frases simples para o modo "Formar frases".
// Cada frase é uma lista de tokens (palavras/partículas). O usuário recebe os
// tokens embaralhados e os coloca na ordem certa. A tradução em português e a
// leitura (furigana/romaji) ajudam quem está começando.
//
// Partículas e o です levam `free: true`: são "peças de gramática" que o app
// mostra desde o começo, então não contam para o progresso do alfabeto. O
// resto (palavras de conteúdo) só aparece quando as famílias já foram vistas.

import { familyOrder } from "./kana";
import { groupsOf } from "./words";

export interface SentenceToken {
  kana: string; // leitura em hiragana do token
  romaji: string;
  kanji?: string; // grafia em kanji, quando houver
  free?: boolean; // partícula/copula: não conta para o progresso
}

export interface Sentence {
  tokens: SentenceToken[];
  meaning: string; // tradução em português
}

// Atalhos para as partículas e o です, que repetem muito.
const wa: SentenceToken = { kana: "は", romaji: "wa", free: true };
const ga: SentenceToken = { kana: "が", romaji: "ga", free: true };
const o: SentenceToken = { kana: "を", romaji: "o", free: true };
const ni: SentenceToken = { kana: "に", romaji: "ni", free: true };
const de: SentenceToken = { kana: "で", romaji: "de", free: true };
const e: SentenceToken = { kana: "へ", romaji: "e", free: true };
const to: SentenceToken = { kana: "と", romaji: "to", free: true };
const no: SentenceToken = { kana: "の", romaji: "no", free: true };
const mo: SentenceToken = { kana: "も", romaji: "mo", free: true };
const ka: SentenceToken = { kana: "か", romaji: "ka", free: true };
const desu: SentenceToken = { kana: "です", romaji: "desu", free: true };

export const sentences: Sentence[] = [
  // --- frases das primeiras famílias (adjetivo + です) ---
  {
    meaning: "Aqui é a casa.",
    tokens: [{ kana: "ここ", romaji: "koko" }, wa, { kana: "いえ", romaji: "ie", kanji: "家" }, desu],
  },
  {
    meaning: "O lago é grande.",
    tokens: [
      { kana: "いけ", romaji: "ike", kanji: "池" },
      ga,
      { kana: "おおきい", romaji: "ookii", kanji: "大きい" },
      desu,
    ],
  },
  {
    meaning: "O rosto está vermelho.",
    tokens: [{ kana: "かお", romaji: "kao", kanji: "顔" }, ga, { kana: "あかい", romaji: "akai", kanji: "赤い" }, desu],
  },
  {
    meaning: "O guarda-chuva é vermelho.",
    tokens: [{ kana: "かさ", romaji: "kasa", kanji: "傘" }, ga, { kana: "あかい", romaji: "akai", kanji: "赤い" }, desu],
  },
  {
    meaning: "O mundo é grande.",
    tokens: [
      { kana: "せかい", romaji: "sekai", kanji: "世界" },
      wa,
      { kana: "おおきい", romaji: "ookii", kanji: "大きい" },
      desu,
    ],
  },
  {
    meaning: "O caqui é gostoso.",
    tokens: [{ kana: "かき", romaji: "kaki", kanji: "柿" }, wa, { kana: "おいしい", romaji: "oishii" }, desu],
  },
  {
    meaning: "A lua está grande.",
    tokens: [
      { kana: "つき", romaji: "tsuki", kanji: "月" },
      ga,
      { kana: "おおきい", romaji: "ookii", kanji: "大きい" },
      desu,
    ],
  },
  {
    meaning: "O polvo é gostoso.",
    tokens: [{ kana: "たこ", romaji: "tako", kanji: "蛸" }, wa, { kana: "おいしい", romaji: "oishii" }, desu],
  },
  {
    meaning: "O pé dói.",
    tokens: [{ kana: "あし", romaji: "ashi", kanji: "足" }, ga, { kana: "いたい", romaji: "itai", kanji: "痛い" }, desu],
  },
  {
    meaning: "Lá fora está quente.",
    tokens: [{ kana: "そと", romaji: "soto", kanji: "外" }, wa, { kana: "あつい", romaji: "atsui", kanji: "暑い" }, desu],
  },
  {
    meaning: "Gosto de cachorros.",
    tokens: [{ kana: "いぬ", romaji: "inu", kanji: "犬" }, ga, { kana: "すき", romaji: "suki", kanji: "好き" }, desu],
  },
  {
    meaning: "Gosto de carne.",
    tokens: [{ kana: "にく", romaji: "niku", kanji: "肉" }, ga, { kana: "すき", romaji: "suki", kanji: "好き" }, desu],
  },
  {
    meaning: "Tem muita gente.",
    tokens: [{ kana: "ひと", romaji: "hito", kanji: "人" }, ga, { kana: "おおい", romaji: "ooi", kanji: "多い" }, desu],
  },
  {
    meaning: "O barco é grande.",
    tokens: [
      { kana: "ふね", romaji: "fune", kanji: "船" },
      wa,
      { kana: "おおきい", romaji: "ookii", kanji: "大きい" },
      desu,
    ],
  },
  {
    meaning: "Gosto do mar.",
    tokens: [{ kana: "うみ", romaji: "umi", kanji: "海" }, ga, { kana: "すき", romaji: "suki", kanji: "好き" }, desu],
  },
  {
    meaning: "A orelha dói.",
    tokens: [{ kana: "みみ", romaji: "mimi", kanji: "耳" }, ga, { kana: "いたい", romaji: "itai", kanji: "痛い" }, desu],
  },
  {
    meaning: "Isto é um guarda-chuva.",
    tokens: [{ kana: "これ", romaji: "kore" }, wa, { kana: "かさ", romaji: "kasa", kanji: "傘" }, desu],
  },
  {
    meaning: "O que é isto?",
    tokens: [{ kana: "これ", romaji: "kore" }, wa, { kana: "なん", romaji: "nan", kanji: "何" }, desu, ka],
  },
  {
    meaning: "O céu é azul.",
    tokens: [{ kana: "そら", romaji: "sora", kanji: "空" }, ga, { kana: "あおい", romaji: "aoi", kanji: "青い" }, desu],
  },
  {
    meaning: "Eu gosto de gatos.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      wa,
      { kana: "ねこ", romaji: "neko", kanji: "猫" },
      ga,
      { kana: "すき", romaji: "suki", kanji: "好き" },
      desu,
    ],
  },
  {
    meaning: "O gato é fofo.",
    tokens: [{ kana: "ねこ", romaji: "neko", kanji: "猫" }, wa, { kana: "かわいい", romaji: "kawaii" }, desu],
  },
  {
    meaning: "A montanha é alta.",
    tokens: [{ kana: "やま", romaji: "yama", kanji: "山" }, ga, { kana: "たかい", romaji: "takai", kanji: "高い" }, desu],
  },
  {
    meaning: "O cachorro é grande.",
    tokens: [
      { kana: "いぬ", romaji: "inu", kanji: "犬" },
      ga,
      { kana: "おおきい", romaji: "ookii", kanji: "大きい" },
      desu,
    ],
  },
  {
    meaning: "Bebo água.",
    tokens: [{ kana: "みず", romaji: "mizu", kanji: "水" }, o, { kana: "のみます", romaji: "nomimasu", kanji: "飲みます" }],
  },
  {
    meaning: "Como carne.",
    tokens: [{ kana: "にく", romaji: "niku", kanji: "肉" }, o, { kana: "たべます", romaji: "tabemasu", kanji: "食べます" }],
  },
  {
    meaning: "Bebo chá.",
    tokens: [{ kana: "おちゃ", romaji: "ocha", kanji: "お茶" }, o, { kana: "のみます", romaji: "nomimasu", kanji: "飲みます" }],
  },
  {
    meaning: "Tomo remédio.",
    tokens: [{ kana: "くすり", romaji: "kusuri", kanji: "薬" }, o, { kana: "のみます", romaji: "nomimasu", kanji: "飲みます" }],
  },
  {
    meaning: "Vou para a estação.",
    tokens: [{ kana: "えき", romaji: "eki", kanji: "駅" }, e, { kana: "いきます", romaji: "ikimasu", kanji: "行きます" }],
  },
  {
    meaning: "Vou ao hospital.",
    tokens: [
      { kana: "びょういん", romaji: "byouin", kanji: "病院" },
      e,
      { kana: "いきます", romaji: "ikimasu", kanji: "行きます" },
    ],
  },
  {
    meaning: "Encontro um amigo.",
    tokens: [
      { kana: "ともだち", romaji: "tomodachi", kanji: "友達" },
      ni,
      { kana: "あいます", romaji: "aimasu", kanji: "会います" },
    ],
  },
  {
    meaning: "Esta flor é vermelha.",
    tokens: [
      { kana: "この", romaji: "kono" },
      { kana: "はな", romaji: "hana", kanji: "花" },
      wa,
      { kana: "あかい", romaji: "akai", kanji: "赤い" },
      desu,
    ],
  },
  {
    meaning: "De manhã, leio um livro.",
    tokens: [
      { kana: "あさ", romaji: "asa", kanji: "朝" },
      { kana: "ほん", romaji: "hon", kanji: "本" },
      o,
      { kana: "よみます", romaji: "yomimasu", kanji: "読みます" },
    ],
  },
  {
    meaning: "De manhã, leio o jornal.",
    tokens: [
      { kana: "あさ", romaji: "asa", kanji: "朝" },
      { kana: "しんぶん", romaji: "shinbun", kanji: "新聞" },
      o,
      { kana: "よみます", romaji: "yomimasu", kanji: "読みます" },
    ],
  },
  {
    meaning: "Estudo japonês.",
    tokens: [
      { kana: "にほんご", romaji: "nihongo", kanji: "日本語" },
      o,
      { kana: "べんきょうします", romaji: "benkyoushimasu", kanji: "勉強します" },
    ],
  },
  {
    meaning: "Aprendo japonês na escola.",
    tokens: [
      { kana: "がっこう", romaji: "gakkou", kanji: "学校" },
      de,
      { kana: "にほんご", romaji: "nihongo", kanji: "日本語" },
      o,
      { kana: "ならいます", romaji: "naraimasu", kanji: "習います" },
    ],
  },
  {
    meaning: "Minha casa é perto.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      no,
      { kana: "いえ", romaji: "ie", kanji: "家" },
      wa,
      { kana: "ちかい", romaji: "chikai", kanji: "近い" },
      desu,
    ],
  },
  {
    meaning: "Hoje está quente.",
    tokens: [{ kana: "きょう", romaji: "kyou", kanji: "今日" }, wa, { kana: "あつい", romaji: "atsui", kanji: "暑い" }, desu],
  },
  {
    meaning: "O verão é quente.",
    tokens: [{ kana: "なつ", romaji: "natsu", kanji: "夏" }, wa, { kana: "あつい", romaji: "atsui", kanji: "暑い" }, desu],
  },
  {
    meaning: "O inverno é frio.",
    tokens: [{ kana: "ふゆ", romaji: "fuyu", kanji: "冬" }, wa, { kana: "さむい", romaji: "samui", kanji: "寒い" }, desu],
  },
  {
    meaning: "Amanhã vou para a escola.",
    tokens: [
      { kana: "あした", romaji: "ashita", kanji: "明日" },
      { kana: "がっこう", romaji: "gakkou", kanji: "学校" },
      e,
      { kana: "いきます", romaji: "ikimasu", kanji: "行きます" },
    ],
  },
  {
    meaning: "Dentro da bolsa há um livro.",
    tokens: [
      { kana: "かばん", romaji: "kaban", kanji: "鞄" },
      no,
      { kana: "なか", romaji: "naka", kanji: "中" },
      ni,
      { kana: "ほん", romaji: "hon", kanji: "本" },
      ga,
      { kana: "あります", romaji: "arimasu" },
    ],
  },
  {
    meaning: "O professor é gentil.",
    tokens: [
      { kana: "せんせい", romaji: "sensei", kanji: "先生" },
      wa,
      { kana: "しんせつ", romaji: "shinsetsu", kanji: "親切" },
      desu,
    ],
  },
  {
    meaning: "Pego o trem.",
    tokens: [{ kana: "でんしゃ", romaji: "densha", kanji: "電車" }, ni, { kana: "のります", romaji: "norimasu", kanji: "乗ります" }],
  },
  {
    meaning: "Vou de carro.",
    tokens: [{ kana: "くるま", romaji: "kuruma", kanji: "車" }, de, { kana: "いきます", romaji: "ikimasu", kanji: "行きます" }],
  },
  {
    meaning: "O sushi é gostoso.",
    tokens: [{ kana: "すし", romaji: "sushi", kanji: "寿司" }, ga, { kana: "おいしい", romaji: "oishii" }, desu],
  },
  {
    meaning: "Abro a janela.",
    tokens: [{ kana: "まど", romaji: "mado", kanji: "窓" }, o, { kana: "あけます", romaji: "akemasu", kanji: "開けます" }],
  },
  {
    meaning: "Apago a luz.",
    tokens: [{ kana: "でんき", romaji: "denki", kanji: "電気" }, o, { kana: "けします", romaji: "keshimasu", kanji: "消します" }],
  },
  {
    meaning: "As flores florescem.",
    tokens: [{ kana: "はな", romaji: "hana", kanji: "花" }, ga, { kana: "さきます", romaji: "sakimasu", kanji: "咲きます" }],
  },
  {
    meaning: "Na primavera as cerejeiras florescem.",
    tokens: [
      { kana: "はる", romaji: "haru", kanji: "春" },
      ni,
      { kana: "さくら", romaji: "sakura", kanji: "桜" },
      ga,
      { kana: "さきます", romaji: "sakimasu", kanji: "咲きます" },
    ],
  },
  {
    meaning: "Neva.",
    tokens: [{ kana: "ゆき", romaji: "yuki", kanji: "雪" }, ga, { kana: "ふります", romaji: "furimasu", kanji: "降ります" }],
  },
  {
    meaning: "Chove.",
    tokens: [{ kana: "あめ", romaji: "ame", kanji: "雨" }, ga, { kana: "ふります", romaji: "furimasu", kanji: "降ります" }],
  },
  {
    meaning: "Eu sou estudante.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      wa,
      { kana: "がくせい", romaji: "gakusei", kanji: "学生" },
      desu,
    ],
  },
  {
    meaning: "Onde é a loja?",
    tokens: [{ kana: "みせ", romaji: "mise", kanji: "店" }, wa, { kana: "どこ", romaji: "doko" }, desu, ka],
  },
  {
    meaning: "Que horas são agora?",
    tokens: [
      { kana: "いま", romaji: "ima", kanji: "今" },
      { kana: "なんじ", romaji: "nanji", kanji: "何時" },
      desu,
      ka,
    ],
  },
  {
    meaning: "Converso com um amigo.",
    tokens: [
      { kana: "ともだち", romaji: "tomodachi", kanji: "友達" },
      to,
      { kana: "はなします", romaji: "hanashimasu", kanji: "話します" },
    ],
  },
  {
    meaning: "Preparo o jantar.",
    tokens: [
      { kana: "ばんごはん", romaji: "bangohan", kanji: "晩ご飯" },
      o,
      { kana: "つくります", romaji: "tsukurimasu", kanji: "作ります" },
    ],
  },
  {
    meaning: "As crianças brincam no parque.",
    tokens: [
      { kana: "こども", romaji: "kodomo", kanji: "子供" },
      ga,
      { kana: "こうえん", romaji: "kouen", kanji: "公園" },
      de,
      { kana: "あそびます", romaji: "asobimasu", kanji: "遊びます" },
    ],
  },
  {
    meaning: "Meu hobby é cozinhar.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      no,
      { kana: "しゅみ", romaji: "shumi", kanji: "趣味" },
      wa,
      { kana: "りょうり", romaji: "ryouri", kanji: "料理" },
      desu,
    ],
  },
  {
    meaning: "Ontem eu vi um filme.",
    tokens: [
      { kana: "きのう", romaji: "kinou", kanji: "昨日" },
      { kana: "えいが", romaji: "eiga", kanji: "映画" },
      o,
      { kana: "みました", romaji: "mimashita", kanji: "見ました" },
    ],
  },
  {
    meaning: "Comi arroz.",
    tokens: [
      { kana: "ごはん", romaji: "gohan", kanji: "ご飯" },
      o,
      { kana: "たべました", romaji: "tabemashita", kanji: "食べました" },
    ],
  },
  {
    meaning: "Amanhã eu descanso.",
    tokens: [
      { kana: "あした", romaji: "ashita", kanji: "明日" },
      { kana: "やすみます", romaji: "yasumimasu", kanji: "休みます" },
    ],
  },
  {
    meaning: "Esta rua é larga.",
    tokens: [
      { kana: "この", romaji: "kono" },
      { kana: "みち", romaji: "michi", kanji: "道" },
      wa,
      { kana: "ひろい", romaji: "hiroi", kanji: "広い" },
      desu,
    ],
  },
  {
    meaning: "Aquele livro é interessante.",
    tokens: [
      { kana: "その", romaji: "sono" },
      { kana: "ほん", romaji: "hon", kanji: "本" },
      wa,
      { kana: "おもしろい", romaji: "omoshiroi", kanji: "面白い" },
      desu,
    ],
  },
  {
    meaning: "O pássaro voa no céu.",
    tokens: [
      { kana: "とり", romaji: "tori", kanji: "鳥" },
      ga,
      { kana: "そら", romaji: "sora", kanji: "空" },
      o,
      { kana: "とびます", romaji: "tobimasu", kanji: "飛びます" },
    ],
  },
  {
    meaning: "Escrevo kanji.",
    tokens: [{ kana: "かんじ", romaji: "kanji", kanji: "漢字" }, o, { kana: "かきます", romaji: "kakimasu", kanji: "書きます" }],
  },
  {
    meaning: "Tiro uma foto.",
    tokens: [
      { kana: "しゃしん", romaji: "shashin", kanji: "写真" },
      o,
      { kana: "とります", romaji: "torimasu", kanji: "撮ります" },
    ],
  },
  {
    meaning: "Eu corro todo dia.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      wa,
      { kana: "まいにち", romaji: "mainichi", kanji: "毎日" },
      { kana: "はしります", romaji: "hashirimasu", kanji: "走ります" },
    ],
  },
  {
    meaning: "Eu também bebo chá.",
    tokens: [
      { kana: "わたし", romaji: "watashi", kanji: "私" },
      mo,
      { kana: "おちゃ", romaji: "ocha", kanji: "お茶" },
      o,
      { kana: "のみます", romaji: "nomimasu", kanji: "飲みます" },
    ],
  },
  {
    meaning: "O metrô é rápido.",
    tokens: [
      { kana: "ちかてつ", romaji: "chikatetsu", kanji: "地下鉄" },
      wa,
      { kana: "はやい", romaji: "hayai", kanji: "速い" },
      desu,
    ],
  },
  {
    meaning: "Compro verduras na quitanda.",
    tokens: [
      { kana: "やおや", romaji: "yaoya", kanji: "八百屋" },
      de,
      { kana: "やさい", romaji: "yasai", kanji: "野菜" },
      o,
      { kana: "かいます", romaji: "kaimasu", kanji: "買います" },
    ],
  },
  {
    meaning: "Este bolso (marmita) é gostoso.",
    tokens: [
      { kana: "この", romaji: "kono" },
      { kana: "べんとう", romaji: "bentou", kanji: "弁当" },
      wa,
      { kana: "おいしい", romaji: "oishii" },
      desu,
    ],
  },
  {
    meaning: "A cidade é silenciosa.",
    tokens: [
      { kana: "まち", romaji: "machi", kanji: "町" },
      wa,
      { kana: "しずか", romaji: "shizuka", kanji: "静か" },
      desu,
    ],
  },
  {
    meaning: "Vou viajar ao Japão.",
    tokens: [
      { kana: "にほん", romaji: "nihon", kanji: "日本" },
      e,
      { kana: "りょこう", romaji: "ryokou", kanji: "旅行" },
      ni,
      { kana: "いきます", romaji: "ikimasu", kanji: "行きます" },
    ],
  },
  {
    meaning: "Meus pais são gentis.",
    tokens: [
      { kana: "りょうしん", romaji: "ryoushin", kanji: "両親" },
      wa,
      { kana: "しんせつ", romaji: "shinsetsu", kanji: "親切" },
      desu,
    ],
  },
];

// ---- PROGRESSO -------------------------------------------------------

// Famílias exigidas pelas palavras de conteúdo da frase (partículas ficam de
// fora: elas aparecem desde o começo como peça fixa de gramática).
export function sentenceGroups(s: Sentence): string[] {
  const set = new Set<string>();
  for (const t of s.tokens) {
    if (t.free) continue;
    for (const g of groupsOf(t.kana)) set.add(g);
  }
  return [...set];
}

// Posição da família mais avançada usada — serve para ordenar por dificuldade.
export function sentenceLevel(s: Sentence): number {
  return sentenceGroups(s).reduce((max, g) => {
    const i = familyOrder.indexOf(g);
    return i > max ? i : max;
  }, 0);
}

const byLevel = [...sentences].sort(
  (a, b) => sentenceLevel(a) - sentenceLevel(b)
);

// Frases adequadas ao progresso. Se ainda houver poucas liberadas, completa
// com as próximas mais fáceis para o modo nunca ficar sem material.
export function sentencesForGroups(taught: string[], min = 8): Sentence[] {
  const set = new Set(taught);
  const ok: Sentence[] = [];
  const rest: Sentence[] = [];
  for (const s of byLevel) {
    if (sentenceGroups(s).every((g) => set.has(g))) ok.push(s);
    else rest.push(s);
  }
  if (ok.length >= min) return ok;
  return [...ok, ...rest.slice(0, min - ok.length)];
}
