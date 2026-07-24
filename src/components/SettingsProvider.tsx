"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { updateDisplaySettings } from "@/app/(app)/settings-actions";

export interface DisplaySettings {
  showRomaji: boolean;
  showFurigana: boolean;
}

interface SettingsContextValue extends DisplaySettings {
  setShowRomaji: (v: boolean) => void;
  setShowFurigana: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  initial,
  children,
}: {
  initial: DisplaySettings;
  children: ReactNode;
}) {
  const [showRomaji, setRomaji] = useState(initial.showRomaji);
  const [showFurigana, setFurigana] = useState(initial.showFurigana);

  // Atualiza a UI na hora (otimista) e persiste na conta em segundo plano.
  const setShowRomaji = useCallback((v: boolean) => {
    setRomaji(v);
    updateDisplaySettings({ show_romaji: v });
  }, []);

  const setShowFurigana = useCallback((v: boolean) => {
    setFurigana(v);
    updateDisplaySettings({ show_furigana: v });
  }, []);

  return (
    <SettingsContext.Provider
      value={{ showRomaji, showFurigana, setShowRomaji, setShowFurigana }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // Fallback seguro fora do provider (ex.: testes): mostra tudo.
    return {
      showRomaji: true,
      showFurigana: true,
      setShowRomaji: () => {},
      setShowFurigana: () => {},
    };
  }
  return ctx;
}
