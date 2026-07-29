"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  updateDisplaySettings,
  updateTaughtGroups,
} from "@/app/(app)/settings-actions";

export interface DisplaySettings {
  showRomaji: boolean;
  showFurigana: boolean;
  taughtGroups: string[];
}

export type SaveState = "idle" | "saving" | "saved" | "local";

interface SettingsContextValue extends DisplaySettings {
  setShowRomaji: (v: boolean) => void;
  setShowFurigana: (v: boolean) => void;
  setTaughtGroups: (g: string[]) => void;
  // "local" = não deu para gravar na conta; valendo só neste aparelho.
  groupsSave: SaveState;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

// Cópia local do progresso, para não perder a escolha se o banco recusar a
// gravação (ex.: migração das colunas novas ainda não aplicada).
const CACHE_KEY = "nihongo:taught-groups";

interface Cache {
  groups: string[];
  dbOk: boolean;
}

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cache;
    if (!Array.isArray(parsed.groups)) return null;
    return { groups: parsed.groups, dbOk: !!parsed.dbOk };
  } catch {
    return null;
  }
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // modo privado / storage cheio: só seguimos sem cache
  }
}

function sameGroups(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((g) => set.has(g));
}

export function SettingsProvider({
  initial,
  children,
}: {
  initial: DisplaySettings;
  children: ReactNode;
}) {
  const [showRomaji, setRomaji] = useState(initial.showRomaji);
  const [showFurigana, setFurigana] = useState(initial.showFurigana);
  const [taughtGroups, setGroups] = useState(initial.taughtGroups);
  const [groupsSave, setGroupsSave] = useState<SaveState>("idle");
  const serverGroups = useRef(initial.taughtGroups);

  // Atualiza a UI na hora (otimista) e persiste na conta em segundo plano.
  const setShowRomaji = useCallback((v: boolean) => {
    setRomaji(v);
    updateDisplaySettings({ show_romaji: v });
  }, []);

  const setShowFurigana = useCallback((v: boolean) => {
    setFurigana(v);
    updateDisplaySettings({ show_furigana: v });
  }, []);

  const save = useCallback((groups: string[]) => {
    setGroupsSave("saving");
    updateTaughtGroups(groups).then((res) => {
      const ok = !!res?.ok;
      writeCache({ groups, dbOk: ok });
      setGroupsSave(ok ? "saved" : "local");
    });
  }, []);

  const setTaughtGroups = useCallback(
    (groups: string[]) => {
      setGroups(groups);
      save(groups);
    },
    [save]
  );

  // Se a última gravação na conta falhou, o valor que vale é o do aparelho:
  // adotamos ele e tentamos gravar de novo (assim que o banco aceitar, o
  // cache volta a concordar com o servidor).
  useEffect(() => {
    const cache = readCache();
    if (!cache || cache.dbOk || cache.groups.length === 0) return;
    if (sameGroups(cache.groups, serverGroups.current)) return;
    setGroups(cache.groups);
    save(cache.groups);
  }, [save]);

  return (
    <SettingsContext.Provider
      value={{
        showRomaji,
        showFurigana,
        taughtGroups,
        setShowRomaji,
        setShowFurigana,
        setTaughtGroups,
        groupsSave,
      }}
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
      taughtGroups: ["vogais"],
      setShowRomaji: () => {},
      setShowFurigana: () => {},
      setTaughtGroups: () => {},
      groupsSave: "idle",
    };
  }
  return ctx;
}
