import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const features = [
  { emoji: "あ", title: "Alfabetos", desc: "Aprenda cada letra de hiragana e katakana, uma a uma." },
  { emoji: "🎴", title: "Flashcards", desc: "Revisão espaçada para fixar kana, vocabulário e kanji." },
  { emoji: "🏯", title: "Níveis JLPT", desc: "Do N5 ao N1, no seu ritmo, com metas claras." },
  { emoji: "⏱️", title: "Competição", desc: "Veja quem estuda por mais tempo no seu grupo." },
  { emoji: "❓", title: "Desafios", desc: "Mande perguntas para amigos e ganhem pontos juntos." },
  { emoji: "🏆", title: "Recompensas", desc: "Some pontos, mantenha o streak e suba no ranking." },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <div className="jp text-6xl font-bold text-[var(--primary)]">日本語</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Nani?!
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted)]">
          Estude japonês — hiragana, katakana e kanji pelos níveis da JLPT — com
          flashcards, metas e uma competição amigável com quem você quiser.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href={user ? "/painel" : "/login"}
            className="rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            {user ? "Ir para o painel" : "Começar agora"}
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            <div className="jp text-3xl">{f.emoji}</div>
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
