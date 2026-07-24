"use client";

import { useState, useTransition } from "react";
import { familyOrder, familySample, groupLabels } from "@/data/kana";
import { updateTaughtGroups } from "@/app/(app)/settings-actions";

// Seletor do progresso: marca quais famílias de kana já foram ensinadas.
// Como o método é cumulativo (uma família nova por dia), oferecemos também
// atalhos "liberar a próxima" e "liberar até aqui".
export default function FamilyPicker({ initial }: { initial: string[] }) {
  const [taught, setTaught] = useState<Set<string>>(new Set(initial));
  const [pending, startTransition] = useTransition();

  function persist(next: Set<string>) {
    setTaught(new Set(next));
    startTransition(() => {
      updateTaughtGroups([...next]);
    });
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
          {pending && " · salvando…"}
        </span>
      </div>

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
