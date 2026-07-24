# Nani?! 🎌

App para estudar japonês — **hiragana, katakana e kanji** pelos níveis da JLPT
(N5 a N1) — com flashcards, cronômetro de estudo, competição em grupo e desafios
de perguntas entre amigos. Feito com **Next.js 16 + Supabase**, pronto para
deploy no **Vercel**.

## Funcionalidades

- 🔤 **Aprender o alfabeto** — hiragana e katakana completos (gojūon, dakuten,
  handakuten e combinações), com leitura em romaji e pronúncia por voz.
- 🧩 **Praticar** — atividades que combinam só as famílias de letras que você já
  ensinou (método "uma família por dia"): **formar palavras** (veja a palavra em
  kanji/hiragana/katakana e monte com as sílabas), **ditado** (ouça e descubra as
  letras), **caça-palavras** e **formar frases**. Você escolhe quais famílias já
  foram ensinadas e as atividades vão liberando palavras conforme o progresso.
- ⚙️ **Configurações** — ligue/desligue o **furigana** (leitura em hiragana sobre
  os kanji) e o **romaji** (leitura em letras). As preferências ficam salvas na
  sua conta.
- 🎴 **Flashcards** — repetição espaçada (caixas de Leitner) para kana e
  vocabulário JLPT. Cada acerto vale pontos.
- 🏯 **Níveis JLPT** — do N5 ao N1, com vocabulário de amostra e escolha do seu
  nível atual.
- ⏱️ **Cronômetro de estudo** — registra automaticamente o tempo estudado.
- 🏆 **Competição** — crie/entre em grupos e veja quem estudou por mais tempo.
- ❓ **Perguntas** — desafie um amigo; se ele acertar, os dois ganham pontos.

## Rodando localmente

### 1. Pré-requisitos
- Node.js 18+ (recomendado 20/22)
- Uma conta no [Supabase](https://supabase.com) (grátis)

### 2. Configurar o Supabase
1. Crie um novo projeto no painel do Supabase.
2. Vá em **SQL Editor > New query**, cole todo o conteúdo de
   [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   - Se o seu banco **já existia** antes destas novidades, rode também a
     migração [`supabase/migrations/2026-07-24_praticar.sql`](supabase/migrations/2026-07-24_praticar.sql)
     (ela adiciona as colunas de preferências e progresso ao seu perfil). Rodar
     o `schema.sql` inteiro de novo também funciona — as adições são seguras de
     reexecutar.
3. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.
4. (Opcional, recomendado pra começar) Em **Authentication > Providers > Email**,
   desative "Confirm email" para poder logar sem confirmar o e-mail durante os
   testes.

### 3. Variáveis de ambiente
Copie o exemplo e preencha com seus valores:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 4. Instalar e rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000, crie uma conta e comece a estudar.

## Deploy no Vercel

1. Suba este projeto para um repositório no GitHub.
2. No [Vercel](https://vercel.com), clique em **New Project** e importe o repo.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Clique em **Deploy**.
5. No Supabase, em **Authentication > URL Configuration**, adicione a URL do
   Vercel (ex.: `https://seu-app.vercel.app`) em **Site URL** / **Redirect URLs**.

## Estrutura

```
src/
  app/
    (app)/              # área autenticada (nav + páginas)
      painel/           # dashboard
      aprender/         # hiragana e katakana
      praticar/         # formar palavras, ditado, caça-palavras, frases
      config/           # preferências (furigana / romaji)
      flashcards/       # treino com repetição espaçada
      jlpt/             # níveis e vocabulário
      competicao/       # grupos e ranking
      perguntas/        # desafios entre usuários
    login/              # autenticação
  components/           # componentes de UI (client)
    practice/           # componentes das atividades de prática
  data/                 # kana, palavras, frases, vocabulário JLPT e decks
  lib/                  # clientes Supabase, auth, helpers
supabase/schema.sql     # schema do banco (rode no Supabase)
supabase/migrations/    # migrações incrementais para bancos já existentes
```

## Como expandir

- **Vocabulário JLPT**: ~8.100 palavras (N5–N1) em
  [`src/data/jlpt/`](src/data/jlpt/), com significados em **inglês**
  (fonte: [open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks),
  baseada nas listas oficiais pré-2010). Para traduzir ao português ou trocar a
  fonte, edite os arquivos `N5.json`…`N1.json`.
- **Sobre "todas as palavras da prova"**: a JLPT não publica lista oficial desde
  2010; estas são as listas de referência da comunidade que os apps usam.
- **Ordem de estudo dos kana por dificuldade** ou **traçado dos caracteres**:
  bons próximos passos.
- **Notificações de perguntas recebidas**: dá pra usar Supabase Realtime.
