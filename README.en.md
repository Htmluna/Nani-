# Nani?! 🎌

🇧🇷 [Leia em português](README.md)

A web app for studying Japanese — **hiragana, katakana and kanji** across the
JLPT levels (N5 to N1) — with practice games, flashcards, a study timer, group
competition and question duels between friends. Built with **Next.js 16 +
Supabase**, ready to deploy on **Vercel**. The interface is in Brazilian
Portuguese.

## Screenshots

_Coming soon._

<!-- Add images here, e.g.:
![Practice screen](docs/images/practice.png)
-->

## Features

- 🔤 **Learn the alphabets** — complete hiragana and katakana (gojūon, dakuten,
  handakuten and combinations), with romaji readings and speech playback.
- 🧩 **Practice** — five activities that only use the kana families you have
  already taught (the "one family a day" method):
  - **Quiz** — multiple choice, mixing three question types: meaning, reading
    (romaji) and writing (from Portuguese to Japanese).
  - **Build words** — see the word in kanji, hiragana or katakana and assemble
    it from syllable tiles.
  - **Dictation** — listen to the word and pick the syllables you heard.
  - **Word search** — find the hidden words in a kana grid.
  - **Build sentences** — put the words in the right order to form a sentence.
- 📈 **Progressive unlocking** — you tick off each kana family as you teach it,
  and every activity immediately reflects the change. The progress is stored in
  your account, with a local copy on the device as a fallback.
- ⚙️ **Display settings** — toggle **furigana** (kana reading above kanji) and
  **romaji** (latin reading). Preferences are saved to your account.
- 🎴 **Flashcards** — spaced repetition (Leitner boxes) for kana and JLPT
  vocabulary. Every correct answer earns points.
- 🏯 **JLPT levels** — N5 to N1, with vocabulary lists and your current level.
- ⏱️ **Study timer** — automatically records how long you studied.
- 🏆 **Competition** — create or join groups and see who studied the most.
- ❓ **Questions** — challenge a friend; if they answer correctly, you both earn
  points.

## Content

| Data set | Size | Where |
| --- | --- | --- |
| Kana | 46 base + 25 dakuten/handakuten + 33 combinations, per syllabary | [`src/data/kana.ts`](src/data/kana.ts) |
| Practice words | 327, tagged by kana family | [`src/data/words.ts`](src/data/words.ts) |
| Practice sentences | 74, tagged by kana family | [`src/data/sentences.ts`](src/data/sentences.ts) |
| JLPT vocabulary | ~8,100 words (N5–N1), meanings in English | [`src/data/jlpt/`](src/data/jlpt/) |

Practice words and sentences are never picked at random with replacement: a
shuffled queue walks through the whole pool before repeating anything, so you do
not see the same exercise twice in a row.

## Running locally

### 1. Requirements
- Node.js 18+ (20/22 recommended)
- A free [Supabase](https://supabase.com) account

### 2. Set up Supabase
1. Create a new project in the Supabase dashboard.
2. Open **SQL Editor > New query**, paste the whole contents of
   [`supabase/schema.sql`](supabase/schema.sql) and hit **Run**.
   - If your database **already existed** before the practice features, also run
     the migration [`supabase/migrations/2026-07-24_praticar.sql`](supabase/migrations/2026-07-24_praticar.sql)
     (it adds the display-preference and progress columns to `profiles`).
     Re-running the whole `schema.sql` works too — the additions are safe to
     execute again. Without those columns the app still works, but your kana
     progress stays on the device and the Practice page shows a warning.
3. In **Project Settings > API**, copy the **Project URL** and the
   **anon public key**.
4. (Optional, handy while testing) In **Authentication > Providers > Email**,
   turn off "Confirm email" so you can sign in without confirming.

### 3. Environment variables
Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000, create an account and start studying.

Useful scripts:

```bash
npm run build   # production build
npm run lint    # eslint
```

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. In [Vercel](https://vercel.com), click **New Project** and import the repo.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values as `.env.local`.
4. Click **Deploy**.
5. Back in Supabase, under **Authentication > URL Configuration**, add your
   Vercel URL (e.g. `https://your-app.vercel.app`) to **Site URL** /
   **Redirect URLs**.

## Project structure

```
src/
  app/
    (app)/              # authenticated area (nav + pages)
      painel/           # dashboard
      aprender/         # hiragana and katakana
      praticar/         # quiz, build words, dictation, word search, sentences
      config/           # display preferences (furigana / romaji)
      flashcards/       # spaced-repetition training
      jlpt/             # levels and vocabulary
      competicao/       # groups and ranking
      perguntas/        # question duels between users
    login/              # authentication
  components/           # client UI components
    practice/           # practice activity components
  data/                 # kana, words, sentences, JLPT vocabulary and decks
  lib/                  # Supabase clients, auth, helpers
supabase/schema.sql     # database schema (run it in Supabase)
supabase/migrations/    # incremental migrations for existing databases
```

## How it works

Every practice word is written in hiragana; its romaji, syllable tiles and kana
families are derived automatically from [`src/data/kana.ts`](src/data/kana.ts).
To unlock a word in an activity, all of its families must already be taught —
so adding vocabulary is just a matter of appending one line to
[`src/data/words.ts`](src/data/words.ts), no tagging required.

The small `っ` (sokuon) has no sound of its own: it doubles the following
consonant (`がっこう` → `gakkou`). It is treated as part of the T line, so words
using it show up once that family is unlocked.

Sentences mark particles and `です` as `free`, meaning they do not count towards
the alphabet progress — they are shown from day one as fixed grammar pieces.

## Ideas for next steps

- **Translate the JLPT vocabulary** to Portuguese (meanings currently come in
  English from [open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks),
  based on the pre-2010 official lists). Note that the JLPT has not published an
  official word list since 2010, so these are the community reference lists that
  most apps use.
- **Stroke order** animations for kana and kanji.
- **Kana ordering by difficulty** instead of the traditional gojūon order.
- **Realtime notifications** for incoming question duels via Supabase Realtime.
