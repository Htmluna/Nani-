// Banco de palavras simples para as atividades de prática.
// Cada palavra é escrita em hiragana; o romaji, os "azulejos" de kana e as
// famílias usadas são derivados automaticamente a partir dos dados de kana.ts.
// Assim, para liberar uma palavra numa atividade, basta que todas as famílias
// dela já tenham sido ensinadas.

import {
  hiraganaBase,
  hiraganaDakuten,
  hiraganaCombo,
  hiraganaSpecial,
} from "./kana";

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
for (const c of [
  ...hiraganaBase,
  ...hiraganaDakuten,
  ...hiraganaCombo,
  ...hiraganaSpecial,
]) {
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
  const units = segment(hira);
  let out = "";
  units.forEach((u, i) => {
    // O つ pequeno não tem som: ele dobra a consoante da sílaba seguinte.
    if (u.kana === "っ") {
      out += units[i + 1]?.romaji.slice(0, 1) ?? "t";
      return;
    }
    out += u.romaji;
  });
  return out;
}

export function groupsOf(hira: string): string[] {
  return [...new Set(segment(hira).map((u) => u.group))];
}

// ---- BANCO DE PALAVRAS ----------------------------------------------
// Ordenadas pela família mais avançada que usam, para acompanhar o método
// (vogais → k → s → ...). Cada bloco só usa kana já visto nos anteriores.
export const words: Word[] = [
  // só vogais
  { hiragana: "あい", meaning: "amor", kanji: "愛" },
  { hiragana: "あお", meaning: "azul", kanji: "青" },
  { hiragana: "あおい", meaning: "azul (é azul)", kanji: "青い" },
  { hiragana: "いえ", meaning: "casa", kanji: "家" },
  { hiragana: "うえ", meaning: "em cima", kanji: "上" },
  { hiragana: "え", meaning: "desenho, quadro", kanji: "絵" },
  { hiragana: "あう", meaning: "encontrar(-se)", kanji: "会う" },
  { hiragana: "いう", meaning: "dizer", kanji: "言う" },
  { hiragana: "おい", meaning: "sobrinho", kanji: "甥" },
  { hiragana: "いいえ", meaning: "não" },
  { hiragana: "うお", meaning: "peixe", kanji: "魚" },
  { hiragana: "おう", meaning: "rei", kanji: "王" },

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
  { hiragana: "あかい", meaning: "vermelho (é vermelho)", kanji: "赤い" },
  { hiragana: "かく", meaning: "escrever", kanji: "書く" },
  { hiragana: "き", meaning: "árvore", kanji: "木" },
  { hiragana: "かう", meaning: "comprar", kanji: "買う" },
  { hiragana: "いく", meaning: "ir", kanji: "行く" },
  { hiragana: "いか", meaning: "lula" },
  { hiragana: "くうき", meaning: "ar", kanji: "空気" },
  { hiragana: "おおきい", meaning: "grande", kanji: "大きい" },
  { hiragana: "おおい", meaning: "muitos", kanji: "多い" },
  { hiragana: "おか", meaning: "colina", kanji: "丘" },
  { hiragana: "かい", meaning: "concha", kanji: "貝" },
  { hiragana: "こい", meaning: "paixão, amor", kanji: "恋" },
  { hiragana: "きおく", meaning: "memória", kanji: "記憶" },

  // + linha S
  { hiragana: "かさ", meaning: "guarda-chuva", kanji: "傘" },
  { hiragana: "あさ", meaning: "manhã", kanji: "朝" },
  { hiragana: "すし", meaning: "sushi", kanji: "寿司" },
  { hiragana: "せき", meaning: "assento", kanji: "席" },
  { hiragana: "しか", meaning: "veado", kanji: "鹿" },
  { hiragana: "さけ", meaning: "saquê", kanji: "酒" },
  { hiragana: "あし", meaning: "pé, perna", kanji: "足" },
  { hiragana: "うそ", meaning: "mentira", kanji: "嘘" },
  { hiragana: "いす", meaning: "cadeira", kanji: "椅子" },
  { hiragana: "すこし", meaning: "um pouco", kanji: "少し" },
  { hiragana: "そこ", meaning: "aí, lá" },
  { hiragana: "すいか", meaning: "melancia", kanji: "西瓜" },
  { hiragana: "しお", meaning: "sal", kanji: "塩" },
  { hiragana: "せかい", meaning: "mundo", kanji: "世界" },
  { hiragana: "おかし", meaning: "doces", kanji: "お菓子" },
  { hiragana: "すき", meaning: "gostar", kanji: "好き" },
  { hiragana: "しあい", meaning: "partida (jogo)", kanji: "試合" },
  { hiragana: "こし", meaning: "quadril, lombar", kanji: "腰" },
  { hiragana: "あす", meaning: "amanhã", kanji: "明日" },
  { hiragana: "さく", meaning: "florescer", kanji: "咲く" },
  { hiragana: "おそい", meaning: "devagar, tarde", kanji: "遅い" },
  { hiragana: "さいこう", meaning: "o máximo, ótimo", kanji: "最高" },

  // + linha T (inclui o っ pequeno)
  { hiragana: "たこ", meaning: "polvo", kanji: "蛸" },
  { hiragana: "くつ", meaning: "sapato", kanji: "靴" },
  { hiragana: "て", meaning: "mão", kanji: "手" },
  { hiragana: "した", meaning: "embaixo", kanji: "下" },
  { hiragana: "つき", meaning: "lua", kanji: "月" },
  { hiragana: "とし", meaning: "ano, idade", kanji: "年" },
  { hiragana: "ち", meaning: "sangue", kanji: "血" },
  { hiragana: "くち", meaning: "boca", kanji: "口" },
  { hiragana: "つち", meaning: "terra, solo", kanji: "土" },
  { hiragana: "ちち", meaning: "pai", kanji: "父" },
  { hiragana: "うた", meaning: "canção", kanji: "歌" },
  { hiragana: "そと", meaning: "fora", kanji: "外" },
  { hiragana: "とけい", meaning: "relógio", kanji: "時計" },
  { hiragana: "つくえ", meaning: "escrivaninha", kanji: "机" },
  { hiragana: "おとこ", meaning: "homem", kanji: "男" },
  { hiragana: "いとこ", meaning: "primo(a)", kanji: "従兄弟" },
  { hiragana: "たいこ", meaning: "tambor", kanji: "太鼓" },
  { hiragana: "ちかてつ", meaning: "metrô", kanji: "地下鉄" },
  { hiragana: "たつ", meaning: "ficar de pé", kanji: "立つ" },
  { hiragana: "あした", meaning: "amanhã", kanji: "明日" },
  { hiragana: "たいせつ", meaning: "importante", kanji: "大切" },
  { hiragana: "ちいさい", meaning: "pequeno", kanji: "小さい" },
  { hiragana: "あつい", meaning: "quente", kanji: "暑い" },
  { hiragana: "たかい", meaning: "alto, caro", kanji: "高い" },
  { hiragana: "とおい", meaning: "longe", kanji: "遠い" },
  { hiragana: "ちかい", meaning: "perto", kanji: "近い" },

  // + linha N
  { hiragana: "ねこ", meaning: "gato", kanji: "猫" },
  { hiragana: "こねこ", meaning: "gatinho", kanji: "子猫" },
  { hiragana: "いぬ", meaning: "cachorro", kanji: "犬" },
  { hiragana: "なに", meaning: "o quê", kanji: "何" },
  { hiragana: "にく", meaning: "carne", kanji: "肉" },
  { hiragana: "なつ", meaning: "verão", kanji: "夏" },
  { hiragana: "なな", meaning: "sete", kanji: "七" },
  { hiragana: "さかな", meaning: "peixe", kanji: "魚" },
  { hiragana: "ぬの", meaning: "tecido", kanji: "布" },
  { hiragana: "にし", meaning: "oeste", kanji: "西" },
  { hiragana: "おかね", meaning: "dinheiro", kanji: "お金" },
  { hiragana: "あなた", meaning: "você", kanji: "貴方" },
  { hiragana: "ねつ", meaning: "febre", kanji: "熱" },
  { hiragana: "なか", meaning: "dentro", kanji: "中" },
  { hiragana: "なく", meaning: "chorar", kanji: "泣く" },
  { hiragana: "あに", meaning: "irmão mais velho", kanji: "兄" },
  { hiragana: "あね", meaning: "irmã mais velha", kanji: "姉" },
  { hiragana: "くに", meaning: "país", kanji: "国" },
  { hiragana: "おとな", meaning: "adulto", kanji: "大人" },
  { hiragana: "なおす", meaning: "consertar", kanji: "直す" },
  { hiragana: "いなか", meaning: "interior, zona rural", kanji: "田舎" },

  // + linha H
  { hiragana: "はな", meaning: "flor", kanji: "花" },
  { hiragana: "ほし", meaning: "estrela", kanji: "星" },
  { hiragana: "ふね", meaning: "barco", kanji: "船" },
  { hiragana: "はこ", meaning: "caixa", kanji: "箱" },
  { hiragana: "ひと", meaning: "pessoa", kanji: "人" },
  { hiragana: "はち", meaning: "oito", kanji: "八" },
  { hiragana: "ほね", meaning: "osso", kanji: "骨" },
  { hiragana: "はし", meaning: "hashi (palitinhos)", kanji: "箸" },
  { hiragana: "はたけ", meaning: "horta, roça", kanji: "畑" },
  { hiragana: "ひこうき", meaning: "avião", kanji: "飛行機" },
  { hiragana: "ふく", meaning: "roupa", kanji: "服" },
  { hiragana: "はなす", meaning: "falar", kanji: "話す" },
  { hiragana: "ほうき", meaning: "vassoura", kanji: "箒" },
  { hiragana: "へた", meaning: "ruim (em algo)", kanji: "下手" },
  { hiragana: "はいく", meaning: "haiku", kanji: "俳句" },
  { hiragana: "ほか", meaning: "outro", kanji: "他" },
  { hiragana: "ひとつ", meaning: "um (contagem)", kanji: "一つ" },
  { hiragana: "ふたつ", meaning: "dois (contagem)", kanji: "二つ" },
  { hiragana: "にほん", meaning: "Japão", kanji: "日本" },
  { hiragana: "さいふ", meaning: "carteira", kanji: "財布" },
  { hiragana: "そふ", meaning: "avô", kanji: "祖父" },
  { hiragana: "たいへん", meaning: "difícil, muito", kanji: "大変" },
  { hiragana: "ふかい", meaning: "profundo", kanji: "深い" },
  { hiragana: "ほそい", meaning: "fino", kanji: "細い" },

  // + linha M
  { hiragana: "みみ", meaning: "orelha", kanji: "耳" },
  { hiragana: "め", meaning: "olho", kanji: "目" },
  { hiragana: "まめ", meaning: "feijão", kanji: "豆" },
  { hiragana: "みせ", meaning: "loja", kanji: "店" },
  { hiragana: "くも", meaning: "nuvem", kanji: "雲" },
  { hiragana: "みち", meaning: "caminho", kanji: "道" },
  { hiragana: "あめ", meaning: "chuva", kanji: "雨" },
  { hiragana: "うみ", meaning: "mar", kanji: "海" },
  { hiragana: "のむ", meaning: "beber", kanji: "飲む" },
  { hiragana: "まち", meaning: "cidade", kanji: "町" },
  { hiragana: "むし", meaning: "insecto", kanji: "虫" },
  { hiragana: "こめ", meaning: "arroz (cru)", kanji: "米" },
  { hiragana: "もの", meaning: "coisa", kanji: "物" },
  { hiragana: "まえ", meaning: "frente, antes", kanji: "前" },
  { hiragana: "みなみ", meaning: "sul", kanji: "南" },
  { hiragana: "むすめ", meaning: "filha", kanji: "娘" },
  { hiragana: "むすこ", meaning: "filho", kanji: "息子" },
  { hiragana: "あたま", meaning: "cabeça", kanji: "頭" },
  { hiragana: "はさみ", meaning: "tesoura", kanji: "鋏" },
  { hiragana: "なまえ", meaning: "nome", kanji: "名前" },
  { hiragana: "むかし", meaning: "antigamente", kanji: "昔" },
  { hiragana: "たてもの", meaning: "prédio", kanji: "建物" },
  { hiragana: "まいにち", meaning: "todo dia", kanji: "毎日" },
  { hiragana: "ねむい", meaning: "com sono", kanji: "眠い" },
  { hiragana: "おもい", meaning: "pesado", kanji: "重い" },
  { hiragana: "さむい", meaning: "frio", kanji: "寒い" },

  // + linha Y
  { hiragana: "やま", meaning: "montanha", kanji: "山" },
  { hiragana: "ゆき", meaning: "neve", kanji: "雪" },
  { hiragana: "やさい", meaning: "verdura, legume", kanji: "野菜" },
  { hiragana: "よむ", meaning: "ler", kanji: "読む" },
  { hiragana: "ふゆ", meaning: "inverno", kanji: "冬" },
  { hiragana: "ゆめ", meaning: "sonho", kanji: "夢" },
  { hiragana: "おゆ", meaning: "água quente", kanji: "お湯" },
  { hiragana: "よこ", meaning: "lado", kanji: "横" },
  { hiragana: "ゆかた", meaning: "yukata (quimono leve)", kanji: "浴衣" },
  { hiragana: "よてい", meaning: "compromisso, planos", kanji: "予定" },
  { hiragana: "やすむ", meaning: "descansar", kanji: "休む" },
  { hiragana: "やおや", meaning: "quitanda", kanji: "八百屋" },
  { hiragana: "ゆうめい", meaning: "famoso", kanji: "有名" },
  { hiragana: "ようふく", meaning: "roupa (ocidental)", kanji: "洋服" },
  { hiragana: "よやく", meaning: "reserva", kanji: "予約" },
  { hiragana: "やすい", meaning: "barato", kanji: "安い" },
  { hiragana: "はやい", meaning: "rápido, cedo", kanji: "早い" },
  { hiragana: "よい", meaning: "bom", kanji: "良い" },
  { hiragana: "つよい", meaning: "forte", kanji: "強い" },

  // + linha R
  { hiragana: "そら", meaning: "céu", kanji: "空" },
  { hiragana: "とり", meaning: "pássaro", kanji: "鳥" },
  { hiragana: "くるま", meaning: "carro", kanji: "車" },
  { hiragana: "はる", meaning: "primavera", kanji: "春" },
  { hiragana: "しろ", meaning: "branco", kanji: "白" },
  { hiragana: "くろ", meaning: "preto", kanji: "黒" },
  { hiragana: "いろ", meaning: "cor", kanji: "色" },
  { hiragana: "よる", meaning: "noite", kanji: "夜" },
  { hiragana: "ひかり", meaning: "luz", kanji: "光" },
  { hiragana: "こおり", meaning: "gelo", kanji: "氷" },
  { hiragana: "さくら", meaning: "cerejeira", kanji: "桜" },
  { hiragana: "とおり", meaning: "rua", kanji: "通り" },
  { hiragana: "れきし", meaning: "história", kanji: "歴史" },
  { hiragana: "くすり", meaning: "remédio", kanji: "薬" },
  { hiragana: "ちから", meaning: "força", kanji: "力" },
  { hiragana: "こころ", meaning: "coração", kanji: "心" },
  { hiragana: "はれ", meaning: "tempo bom", kanji: "晴れ" },
  { hiragana: "ひとり", meaning: "uma pessoa, sozinho", kanji: "一人" },
  { hiragana: "さようなら", meaning: "adeus, tchau" },
  { hiragana: "はしる", meaning: "correr", kanji: "走る" },
  { hiragana: "みる", meaning: "ver", kanji: "見る" },
  { hiragana: "しる", meaning: "saber", kanji: "知る" },
  { hiragana: "ある", meaning: "existir, ter", kanji: "有る" },
  { hiragana: "おもしろい", meaning: "interessante, divertido", kanji: "面白い" },
  { hiragana: "ふるい", meaning: "velho (coisa)", kanji: "古い" },
  { hiragana: "あかるい", meaning: "claro, iluminado", kanji: "明るい" },
  { hiragana: "ひろい", meaning: "amplo, largo", kanji: "広い" },
  { hiragana: "からい", meaning: "apimentado", kanji: "辛い" },
  { hiragana: "あたらしい", meaning: "novo", kanji: "新しい" },

  // + linha W / N
  { hiragana: "かわ", meaning: "rio", kanji: "川" },
  { hiragana: "わたし", meaning: "eu", kanji: "私" },
  { hiragana: "ほん", meaning: "livro", kanji: "本" },
  { hiragana: "にわ", meaning: "quintal, jardim", kanji: "庭" },
  { hiragana: "せんせい", meaning: "professor(a)", kanji: "先生" },
  { hiragana: "おんな", meaning: "mulher", kanji: "女" },
  { hiragana: "ふとん", meaning: "futon", kanji: "布団" },
  { hiragana: "みかん", meaning: "tangerina", kanji: "蜜柑" },
  { hiragana: "てんき", meaning: "tempo, clima", kanji: "天気" },
  { hiragana: "こうえん", meaning: "parque", kanji: "公園" },
  { hiragana: "おんせん", meaning: "fonte termal", kanji: "温泉" },
  { hiragana: "しんかんせん", meaning: "trem-bala", kanji: "新幹線" },
  { hiragana: "せんたく", meaning: "lavar roupa", kanji: "洗濯" },
  { hiragana: "しんせつ", meaning: "gentil", kanji: "親切" },
  { hiragana: "ほんとう", meaning: "verdade", kanji: "本当" },
  { hiragana: "こんにちは", meaning: "bom dia, olá" },
  { hiragana: "わかる", meaning: "entender", kanji: "分かる" },
  { hiragana: "わすれる", meaning: "esquecer", kanji: "忘れる" },
  { hiragana: "わかい", meaning: "jovem", kanji: "若い" },
  { hiragana: "わるい", meaning: "ruim", kanji: "悪い" },

  // + linha G (dakuten)
  { hiragana: "かぎ", meaning: "chave", kanji: "鍵" },
  { hiragana: "たまご", meaning: "ovo", kanji: "卵" },
  { hiragana: "めがね", meaning: "óculos", kanji: "眼鏡" },
  { hiragana: "にほんご", meaning: "japonês (língua)", kanji: "日本語" },
  { hiragana: "いちご", meaning: "morango", kanji: "苺" },
  { hiragana: "ありがとう", meaning: "obrigado(a)" },
  { hiragana: "ごはん", meaning: "arroz cozido, comida", kanji: "ご飯" },
  { hiragana: "がっこう", meaning: "escola", kanji: "学校" },
  { hiragana: "ぎんこう", meaning: "banco", kanji: "銀行" },
  { hiragana: "げんき", meaning: "animado, bem de saúde", kanji: "元気" },
  { hiragana: "ごご", meaning: "à tarde", kanji: "午後" },
  { hiragana: "かぐ", meaning: "móveis", kanji: "家具" },
  { hiragana: "かがみ", meaning: "espelho", kanji: "鏡" },
  { hiragana: "げんかん", meaning: "entrada da casa", kanji: "玄関" },
  { hiragana: "がいこく", meaning: "exterior, estrangeiro", kanji: "外国" },
  { hiragana: "ごみ", meaning: "lixo" },
  { hiragana: "いそぐ", meaning: "apressar-se", kanji: "急ぐ" },
  { hiragana: "あげる", meaning: "dar, erguer", kanji: "上げる" },
  { hiragana: "ながい", meaning: "comprido", kanji: "長い" },

  // + linha Z (dakuten)
  { hiragana: "みず", meaning: "água", kanji: "水" },
  { hiragana: "ちず", meaning: "mapa", kanji: "地図" },
  { hiragana: "じかん", meaning: "tempo, hora", kanji: "時間" },
  { hiragana: "かんじ", meaning: "kanji", kanji: "漢字" },
  { hiragana: "ざっし", meaning: "revista", kanji: "雑誌" },
  { hiragana: "かぞく", meaning: "família", kanji: "家族" },
  { hiragana: "しずか", meaning: "silencioso", kanji: "静か" },
  { hiragana: "じしん", meaning: "terremoto", kanji: "地震" },
  { hiragana: "そうじ", meaning: "limpeza", kanji: "掃除" },
  { hiragana: "ひざ", meaning: "joelho", kanji: "膝" },
  { hiragana: "ねずみ", meaning: "rato", kanji: "鼠" },
  { hiragana: "ぞう", meaning: "elefante", kanji: "象" },
  { hiragana: "じこ", meaning: "acidente", kanji: "事故" },
  { hiragana: "はじめ", meaning: "começo", kanji: "初め" },
  { hiragana: "ずっと", meaning: "muito mais, o tempo todo" },
  { hiragana: "みじかい", meaning: "curto", kanji: "短い" },
  { hiragana: "すずしい", meaning: "fresco (clima)", kanji: "涼しい" },

  // + linha D (dakuten)
  { hiragana: "でんわ", meaning: "telefone", kanji: "電話" },
  { hiragana: "でんき", meaning: "luz, eletricidade", kanji: "電気" },
  { hiragana: "どこ", meaning: "onde", kanji: "何処" },
  { hiragana: "ともだち", meaning: "amigo(a)", kanji: "友達" },
  { hiragana: "からだ", meaning: "corpo", kanji: "体" },
  { hiragana: "まど", meaning: "janela", kanji: "窓" },
  { hiragana: "くだもの", meaning: "fruta", kanji: "果物" },
  { hiragana: "こども", meaning: "criança", kanji: "子供" },
  { hiragana: "でぐち", meaning: "saída", kanji: "出口" },
  { hiragana: "だいがく", meaning: "universidade", kanji: "大学" },
  { hiragana: "だいどころ", meaning: "cozinha", kanji: "台所" },
  { hiragana: "どうぞ", meaning: "por favor, aqui está" },
  { hiragana: "どうも", meaning: "obrigado (informal)" },
  { hiragana: "どんな", meaning: "que tipo de" },
  { hiragana: "でる", meaning: "sair", kanji: "出る" },
  { hiragana: "だす", meaning: "tirar, enviar", kanji: "出す" },

  // + linha B (dakuten)
  { hiragana: "ぶた", meaning: "porco", kanji: "豚" },
  { hiragana: "かばん", meaning: "bolsa", kanji: "鞄" },
  { hiragana: "たべる", meaning: "comer", kanji: "食べる" },
  { hiragana: "あそぶ", meaning: "brincar", kanji: "遊ぶ" },
  { hiragana: "ぜんぶ", meaning: "tudo", kanji: "全部" },
  { hiragana: "しんぶん", meaning: "jornal", kanji: "新聞" },
  { hiragana: "くび", meaning: "pescoço", kanji: "首" },
  { hiragana: "そば", meaning: "soba (macarrão)", kanji: "蕎麦" },
  { hiragana: "たばこ", meaning: "cigarro", kanji: "煙草" },
  { hiragana: "べんとう", meaning: "marmita", kanji: "弁当" },
  { hiragana: "ゆびわ", meaning: "anel", kanji: "指輪" },
  { hiragana: "なべ", meaning: "panela", kanji: "鍋" },
  { hiragana: "ぼうし", meaning: "chapéu, boné", kanji: "帽子" },
  { hiragana: "どようび", meaning: "sábado", kanji: "土曜日" },
  { hiragana: "げつようび", meaning: "segunda-feira", kanji: "月曜日" },
  { hiragana: "ぶんか", meaning: "cultura", kanji: "文化" },
  { hiragana: "ばんごはん", meaning: "jantar", kanji: "晩ご飯" },
  { hiragana: "そぼ", meaning: "avó", kanji: "祖母" },
  { hiragana: "いちばん", meaning: "o primeiro, o mais", kanji: "一番" },
  { hiragana: "あぶない", meaning: "perigoso", kanji: "危ない" },

  // + linha P (handakuten)
  { hiragana: "さんぽ", meaning: "passeio, caminhada", kanji: "散歩" },
  { hiragana: "えんぴつ", meaning: "lápis", kanji: "鉛筆" },
  { hiragana: "いっぱい", meaning: "cheio, bastante", kanji: "一杯" },
  { hiragana: "きっぷ", meaning: "bilhete, passagem", kanji: "切符" },
  { hiragana: "しんぱい", meaning: "preocupação", kanji: "心配" },
  { hiragana: "てんぷら", meaning: "tempurá", kanji: "天ぷら" },
  { hiragana: "せんぱい", meaning: "veterano (mais experiente)", kanji: "先輩" },
  { hiragana: "いっぽ", meaning: "um passo", kanji: "一歩" },
  { hiragana: "かんぺき", meaning: "perfeito", kanji: "完璧" },

  // + combinações (yōon)
  { hiragana: "きょう", meaning: "hoje", kanji: "今日" },
  { hiragana: "とうきょう", meaning: "Tóquio", kanji: "東京" },
  { hiragana: "きょうと", meaning: "Quioto", kanji: "京都" },
  { hiragana: "りょうり", meaning: "comida, culinária", kanji: "料理" },
  { hiragana: "でんしゃ", meaning: "trem", kanji: "電車" },
  { hiragana: "じてんしゃ", meaning: "bicicleta", kanji: "自転車" },
  { hiragana: "びょういん", meaning: "hospital", kanji: "病院" },
  { hiragana: "しゅくだい", meaning: "tarefa de casa", kanji: "宿題" },
  { hiragana: "しゃしん", meaning: "foto", kanji: "写真" },
  { hiragana: "じょうず", meaning: "habilidoso, bom em algo", kanji: "上手" },
  { hiragana: "べんきょう", meaning: "estudo", kanji: "勉強" },
  { hiragana: "ぎゅうにゅう", meaning: "leite", kanji: "牛乳" },
  { hiragana: "きゃく", meaning: "cliente, visita", kanji: "客" },
  { hiragana: "しょくじ", meaning: "refeição", kanji: "食事" },
  { hiragana: "ひゃく", meaning: "cem", kanji: "百" },
  { hiragana: "りょこう", meaning: "viagem", kanji: "旅行" },
  { hiragana: "じゅぎょう", meaning: "aula", kanji: "授業" },
  { hiragana: "しゅみ", meaning: "hobby", kanji: "趣味" },
  { hiragana: "おちゃ", meaning: "chá", kanji: "お茶" },
  { hiragana: "こうちゃ", meaning: "chá preto", kanji: "紅茶" },
  { hiragana: "しょうゆ", meaning: "shoyu", kanji: "醤油" },
  { hiragana: "きんぎょ", meaning: "peixinho dourado", kanji: "金魚" },
  { hiragana: "びじゅつかん", meaning: "museu de arte", kanji: "美術館" },
  { hiragana: "りょうしん", meaning: "os pais", kanji: "両親" },
  { hiragana: "ちょっと", meaning: "um pouquinho" },
];

// Palavras cujas famílias já foram todas ensinadas.
export function wordsForGroups(taught: string[]): Word[] {
  const set = new Set(taught);
  return words.filter((w) => groupsOf(w.hiragana).every((g) => set.has(g)));
}
