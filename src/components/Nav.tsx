"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";

const links = [
  { href: "/painel", label: "Painel", icon: "🏠" },
  { href: "/aprender", label: "Aprender", icon: "あ" },
  { href: "/praticar", label: "Praticar", icon: "🧩" },
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
    // Mobile: barra fixa embaixo (tab bar). Desktop (md+): sidebar lateral.
    <aside className="fixed inset-x-0 bottom-0 z-40 flex flex-row items-stretch gap-1 border-t border-[var(--border)] bg-[var(--card)] px-1 pb-[env(safe-area-inset-bottom)] pt-1 md:static md:h-screen md:w-60 md:flex-col md:items-stretch md:gap-1 md:border-r md:border-t-0 md:px-3 md:pb-6 md:pt-6">
      <div className="hidden items-center gap-2 md:mb-6 md:flex md:px-3">
        <span className="jp text-2xl font-bold text-[var(--primary)]">日</span>
        <span className="font-bold">Nani?!</span>
      </div>

      <nav className="flex flex-1 flex-row justify-around gap-0.5 md:flex-none md:flex-col md:justify-start md:gap-1">
        {links.map((l) => {
          const active =
            pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-sm font-medium transition md:flex-none md:flex-row md:justify-start md:gap-2 md:px-3 md:py-2 ${
                active
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "hover:bg-[var(--background)]"
              }`}
            >
              <span className="jp text-2xl md:text-base">{l.icon}</span>
              <span className="hidden md:inline">{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-stretch md:mt-auto md:flex-col md:items-stretch md:gap-3 md:pt-6">
        <div className="hidden rounded-lg bg-[var(--background)] px-3 py-2 text-sm md:block">
          <div className="font-medium">{username}</div>
          <div className="text-[var(--muted)]">🏆 {points} pts</div>
        </div>
        <Link
          href="/config"
          aria-label="Configurações"
          className={`hidden flex-1 items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm transition md:flex md:flex-none md:flex-row md:justify-start md:gap-2 md:px-3 ${
            pathname === "/config"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "hover:bg-[var(--background)]"
          }`}
        >
          <span className="text-2xl md:text-base">⚙️</span>
          <span className="hidden md:inline">Configurações</span>
        </Link>
        <form action={signOut} className="flex">
          <button
            type="submit"
            aria-label="Sair"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm transition hover:bg-[var(--background)] md:w-full md:flex-row md:justify-center md:border md:border-[var(--border)]"
          >
            <span className="text-2xl md:hidden">🚪</span>
            <span className="hidden md:inline">Sair</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
