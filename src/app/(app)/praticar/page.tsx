import Link from "next/link";
import FamilyPicker from "@/components/practice/FamilyPicker";
import { requireProfile } from "@/lib/auth";
import { wordsForGroups } from "@/data/words";
import { groupLabels } from "@/data/kana";

export default async function PraticarPage() {
  const profile = await requireProfile();
  const taught = profile.taught_groups;
  const available = wordsForGroups(taught);

  const modes = [
    {
      href: "/praticar/formar-palavras",
      icon: "🧩",
      title: "Formar palavras",
      desc: "Veja a palavra (kanji, hiragana ou katakana) e monte com as sílabas certas.",
    },
    {
      href: "/praticar/ditado",
      icon: "🎧",
      title: "Ditado",
      desc: "Ouça uma palavra e escolha quais letras foram usadas.",
    },
    {
      href: "/praticar/caca-palavras",
      icon: "🔎",
      title: "Caça-palavras",
      desc: "Ache as palavras escondidas na grade, só com as famílias liberadas.",
    },
    {
      href: "/praticar/frases",
      icon: "📝",
      title: "Formar frases",
      desc: "Coloque as palavras na ordem certa para montar frases simples.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Praticar</h1>
          <p className="mt-1 text-[var(--muted)]">
            Atividades que usam só as famílias de letras que você já ensinou.
          </p>
        </div>
        <Link
          href="/config"
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--background)]"
        >
          ⚙️ Configurações
        </Link>
      </div>

      {/* Progresso: quais famílias já foram ensinadas */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h2 className="font-semibold">Famílias ensinadas</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Marque a cada dia a família nova que você ensinou. As atividades vão
          combinando só o que está liberado.
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Liberadas:{" "}
          <span className="font-medium text-[var(--foreground)]">
            {taught.map((g) => groupLabels[g] ?? g).join(", ") || "nenhuma"}
          </span>{" "}
          · <strong>{available.length}</strong> palavra(s) disponível(is).
        </p>
        <div className="mt-4">
          <FamilyPicker initial={taught} />
        </div>
      </section>

      {/* Modos de estudo */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {modes.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--primary)]"
          >
            <div className="text-3xl">{m.icon}</div>
            <h3 className="mt-2 font-semibold">{m.title}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
