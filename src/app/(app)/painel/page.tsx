import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { jlptDescriptions } from "@/data/jlpt";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

export default async function PainelPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const [{ data: sessions }, { count: pendingCount }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("seconds")
      .eq("user_id", profile.id)
      .gte("studied_at", weekAgo),
    supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("target_id", profile.id)
      .eq("status", "pendente"),
  ]);

  const weekSeconds = (sessions ?? []).reduce((t, s) => t + s.seconds, 0);

  const stats = [
    { label: "Pontos", value: profile.points, icon: "🏆" },
    { label: "Sequência", value: `${profile.streak} dias`, icon: "🔥" },
    { label: "Estudo (7 dias)", value: formatDuration(weekSeconds), icon: "⏱️" },
    { label: "Seu nível", value: profile.jlpt_level, icon: "🏯" },
  ];

  const shortcuts = [
    { href: "/aprender", title: "Aprender o alfabeto", desc: "Hiragana e katakana, letra por letra", icon: "あ" },
    { href: "/praticar", title: "Praticar", desc: "Formar palavras, ditado, caça-palavras e frases", icon: "🧩" },
    { href: "/flashcards", title: "Revisar flashcards", desc: "Fixe o que já estudou", icon: "🎴" },
    { href: "/jlpt", title: "Estudar JLPT", desc: "Vocabulário do seu nível", icon: "🏯" },
    { href: "/competicao", title: "Ver ranking", desc: "Como está sua competição", icon: "🏆" },
    { href: "/config", title: "Configurações", desc: "Romaji e furigana (leitura dos kanji)", icon: "⚙️" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold">
        Olá, {profile.username}! 👋
      </h1>
      <p className="mt-1 text-[var(--muted)]">
        {jlptDescriptions[profile.jlpt_level]}
      </p>

      {(pendingCount ?? 0) > 0 && (
        <Link
          href="/perguntas"
          className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/5 px-4 py-3 text-sm font-medium"
        >
          ❓ Você tem {pendingCount} pergunta(s) esperando resposta →
        </Link>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-2 text-xl font-bold">{s.value}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-semibold">Continuar estudando</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]"
          >
            <span className="jp text-3xl">{s.icon}</span>
            <span>
              <span className="block font-semibold">{s.title}</span>
              <span className="block text-sm text-[var(--muted)]">
                {s.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
