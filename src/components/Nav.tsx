"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";

const links = [
  { href: "/painel", label: "Painel", icon: "🏠" },
  { href: "/aprender", label: "Aprender", icon: "あ" },
  { href: "/flashcards", label: "Flashcards", icon: "🎴" },
  { href: "/jlpt", label: "Níveis JLPT", icon: "🏯" },
  { href: "/competicao", label: "Competição", icon: "🏆" },
  { href: "/perguntas", label: "Perguntas", icon: "❓" },
];

export default function Nav({
  username,
  points,
}: {
  username: string;
  points: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-row items-center gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--card)] px-3 py-2 md:h-screen md:w-60 md:flex-col md:items-stretch md:overflow-y-auto md:border-b-0 md:border-r md:py-6">
      <div className="mr-3 flex shrink-0 items-center gap-2 md:mb-6 md:mr-0 md:px-3">
        <span className="jp text-2xl font-bold text-[var(--primary)]">日</span>
        <span className="hidden font-bold md:inline">Nani?!</span>
      </div>

      <nav className="flex flex-row gap-1 md:flex-col">
        {links.map((l) => {
          const active =
            pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "hover:bg-[var(--background)]"
              }`}
            >
              <span className="jp">{l.icon}</span>
              <span className="hidden md:inline">{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3 md:ml-0 md:mt-auto md:flex-col md:items-stretch md:pt-6">
        <div className="hidden rounded-lg bg-[var(--background)] px-3 py-2 text-sm md:block">
          <div className="font-medium">{username}</div>
          <div className="text-[var(--muted)]">🏆 {points} pts</div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition hover:bg-[var(--background)] md:w-full"
          >
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
