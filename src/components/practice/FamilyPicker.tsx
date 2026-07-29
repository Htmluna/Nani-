"use client";

import { useMemo } from "react";
import { familyOrder, familySample, groupLabels } from "@/data/kana";
import { wordsForGroups } from "@/data/words";
import { useSettings } from "@/components/SettingsProvider";

// Seletor do progresso: marca quais famílias de kana já foram ensinadas.
// Como o método é cumulativo (uma família nova por dia), oferecemos também
// atalhos "liberar a próxima" e "liberar até aqui".
// O progresso vive no contexto de configurações, então as atividades reagem na
// hora — sem precisar recarregar a página.
export default function FamilyPicker() {
  const { taughtGroups, setTaughtGroups, groupsSave } = useSettings();
  const taught = useMemo(() => new Set(taughtGroups), [taughtGroups]);
  const available = useMemo(() => wordsForGroups(taughtGroups), [taughtGroups]);

  // Salva sempre na ordem do método, para a lista ficar legível.
  function persist(next: Set<string>) {
    setTaughtGroups(familyOrder.filter((g) => next.has(g)));
  }

  function toggle(group: string) {
    const next = new Set(taught);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    persist(next);
  }

  // Índice da última família liberada (na ordem do método).
  const lastIndex = familyOrder.reduce(
    (acc, g, i) => (taught.has(g) ? i : acc),
    -1
  );

  function unlockNext() {
    const nextIndex = lastIndex + 1;
    if (nextIndex >= familyOrder.length) return;
    const next = new Set(taught);
    next.add(familyOrder[nextIndex]);
    persist(next);
  }

  function unlockUpTo(index: number) {
    const next = new Set(taught);
    for (let i = 0; i <= index; i++) next.add(familyOrder[i]);
    persist(next);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-[var(--muted)]">
        Liberadas:{" "}
        <span className="font-medium text-[var(--foreground)]">
          {taughtGroups.map((g) => groupLabels[g] ?? g).join(", ") || "nenhuma"}
        </span>{" "}
        · <strong>{available.length}</strong> palavra(s) nas atividades.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={unlockNext}
          disabled={lastIndex + 1 >= familyOrder.length}
          className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-40"
        >
          + Liberar próxima família
        </button>
        <span className="text-sm text-[var(--muted)]">
          {taught.size} de {familyOrder.length} liberadas
          {groupsSave === "saving" && " · salvando…"}
          {groupsSave === "saved" && " · salvo ✓"}
        </span>
      </div>

      {groupsSave === "local" && (
        <p className="mb-3 rounded-xl border border-amber-500 bg-amber-500/10 px-3 py-2 text-sm">
          ⚠️ Não consegui salvar na sua conta — o progresso está guardado só
          neste aparelho. Rode a migração{" "}
          <code className="text-xs">supabase/migrations/2026-07-24_praticar.sql</code>{" "}
          no painel do Supabase para sincronizar.
        </p>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {familyOrder.map((group, i) => {
          const on = taught.has(group);
          return (
            <div
              key={group}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition ${
                on
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <button
                onClick={() => toggle(group)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs ${
                    on
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  {on ? "✓" : i + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium">
                    {groupLabels[group]}
                  </span>
                  <span className="jp block text-lg">
                    {familySample(group)}
                  </span>
                </span>
              </button>
              {!on && (
                <button
                  onClick={() => unlockUpTo(i)}
                  className="shrink-0 rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--background)]"
                >
                  até aqui
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
