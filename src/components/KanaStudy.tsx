"use client";

import { useState } from "react";
import type { KanaChar } from "@/data/kana";
import { groupLabels } from "@/data/kana";

// Aproximação da pronúncia em português para ajudar quem está começando.
function pronunciaPt(romaji: string): string {
  const map: Record<string, string> = {
    a: "á (como em 'casa')",
    i: "i (como em 'vi')",
    u: "u (som curto, entre 'u' e 'ü')",
    e: "ê (como em 'você')",
    o: "ó (como em 'avó')",
    shi: "'shi' (como em 'xícara')",
    chi: "'tchi'",
    tsu: "'tsu' (t + su rápido)",
    fu: "'fu' (sopro leve, quase 'hu')",
    r: "r brando (entre 'r' e 'l')",
    n: "'n' nasal (como no fim de 'sim')",
    ja: "'já'",
    ju: "'ju' (como em 'juba')",
    jo: "'jó'",
  };
  if (map[romaji]) return map[romaji];
  if (romaji.startsWith("r")) return `${romaji} — r brando, quase 'l'`;
  if (romaji.startsWith("ch")) return romaji.replace("ch", "tch");
  return `lê-se aproximadamente como está escrito: "${romaji}"`;
}

function speak(kana: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(kana);
  u.lang = "ja-JP";
  u.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function KanaStudy({
  title,
  sections,
}: {
  title: string;
  sections: { key: string; label: string; chars: KanaChar[] }[];
}) {
  const [selected, setSelected] = useState<KanaChar | null>(
    sections[0]?.chars[0] ?? null
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        {sections.map((section) => (
          <section key={section.key} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              {section.label}
            </h2>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
              {section.chars.map((c) => (
                <button
                  key={c.kana}
                  onClick={() => {
                    setSelected(c);
                    speak(c.kana);
                  }}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border transition ${
                    selected?.kana === c.kana
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]"
                  }`}
                >
                  <span className="jp text-2xl">{c.kana}</span>
                  <span className="text-[10px] text-[var(--muted)]">
                    {c.romaji}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
            <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {title} · {groupLabels[selected.group] ?? selected.group}
            </div>
            <div className="jp mt-3 text-8xl leading-none">{selected.kana}</div>
            <div className="mt-3 text-2xl font-bold text-[var(--primary)]">
              {selected.romaji}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {pronunciaPt(selected.romaji)}
            </p>
            <button
              onClick={() => speak(selected.kana)}
              className="mt-4 w-full rounded-lg bg-[var(--accent)] py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              🔊 Ouvir pronúncia
            </button>
            <p className="mt-3 text-xs text-[var(--muted)]">
              A pronúncia usa a voz japonesa do seu navegador (se disponível).
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
