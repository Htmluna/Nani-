"use client";

import Toggle from "./Toggle";
import JpWord from "./JpWord";
import { useSettings } from "./SettingsProvider";

// Painel de preferências de exibição. Lê e grava no contexto (que sincroniza
// com a conta). O exemplo ao lado mostra o efeito na hora.
export default function SettingsForm() {
  const { showRomaji, showFurigana, setShowRomaji, setShowFurigana } =
    useSettings();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Furigana nos kanji</div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Mostra a leitura em hiragana por cima dos kanji. Desligue para
              treinar a leitura sem ajuda.
            </p>
          </div>
          <Toggle
            checked={showFurigana}
            onChange={setShowFurigana}
            label="Furigana nos kanji"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Romaji (leitura em letras)</div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Mostra como se lê usando o nosso alfabeto. Desligue quando já
              estiver lendo direto o kana.
            </p>
          </div>
          <Toggle
            checked={showRomaji}
            onChange={setShowRomaji}
            label="Romaji"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Prévia
        </div>
        <div className="mt-3 flex items-center justify-center">
          <JpWord
            kana="かさ"
            kanji="傘"
            romaji="kasa"
            className="text-5xl"
            romajiClassName="mt-1 text-base"
          />
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">傘 = guarda-chuva</p>
      </div>
    </div>
  );
}
