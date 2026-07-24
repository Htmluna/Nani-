"use client";

import { useSettings } from "./SettingsProvider";

// Renderiza uma palavra japonesa respeitando as preferências do usuário:
// - furigana ligado: o kanji aparece com a leitura em hiragana por cima (ruby);
//   desligado: só o kanji (bom para testar a leitura).
// - romaji ligado: mostra a leitura latina embaixo, em cinza.
// Sem kanji, mostra o próprio kana.
export default function JpWord({
  kana,
  kanji,
  romaji,
  className = "",
  romajiClassName = "",
}: {
  kana: string; // leitura em hiragana
  kanji?: string;
  romaji?: string;
  className?: string;
  romajiClassName?: string;
}) {
  const { showRomaji, showFurigana } = useSettings();
  const hasKanji = !!kanji && kanji !== kana;

  return (
    <span className="inline-flex flex-col items-center leading-tight">
      {hasKanji && showFurigana ? (
        <ruby className={`jp ${className}`}>
          {kanji}
          <rt className="jp text-[0.5em] font-normal text-[var(--muted)]">
            {kana}
          </rt>
        </ruby>
      ) : (
        <span className={`jp ${className}`}>{hasKanji ? kanji : kana}</span>
      )}
      {showRomaji && romaji && (
        <span className={`text-[var(--muted)] ${romajiClassName}`}>
          {romaji}
        </span>
      )}
    </span>
  );
}
