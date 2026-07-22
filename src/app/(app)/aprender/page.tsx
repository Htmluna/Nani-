import Link from "next/link";

export default function AprenderPage() {
  const options = [
    {
      href: "/aprender/hiragana",
      title: "Hiragana",
      sample: "あいうえお",
      desc: "O silabário básico, usado em palavras japonesas, partículas e terminações. Comece por aqui.",
    },
    {
      href: "/aprender/katakana",
      title: "Katakana",
      sample: "アイウエオ",
      desc: "Usado para palavras estrangeiras, nomes e ênfase. Mesmos sons do hiragana, grafia diferente.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Aprender o alfabeto</h1>
      <p className="mt-1 text-[var(--muted)]">
        O japonês tem dois silabários (kana). Cada símbolo representa uma sílaba.
        Escolha um para estudar letra por letra.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:border-[var(--primary)]"
          >
            <div className="jp text-3xl text-[var(--primary)]">{o.sample}</div>
            <h2 className="mt-3 text-lg font-semibold">{o.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{o.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
        <strong className="text-[var(--foreground)]">Dica:</strong> aprenda
        primeiro as 46 letras básicas de cada silabário. Depois avance para os
        sons com dakuten (゛), handakuten (゜) e as combinações (yōon).
      </div>
    </div>
  );
}
