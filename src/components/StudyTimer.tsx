"use client";

import { useEffect, useRef, useState } from "react";
import { logStudy } from "@/app/(app)/study-actions";

// Conta o tempo em que a aba está visível e envia ao servidor a cada 30s.
export default function StudyTimer({ activity }: { activity: string }) {
  const [elapsed, setElapsed] = useState(0);
  const unsaved = useRef(0);

  useEffect(() => {
    const tick = setInterval(() => {
      if (document.visibilityState === "visible") {
        setElapsed((e) => e + 1);
        unsaved.current += 1;
      }
    }, 1000);

    const flush = () => {
      if (unsaved.current >= 5) {
        logStudy(unsaved.current, activity);
        unsaved.current = 0;
      }
    };
    const save = setInterval(flush, 30000);

    return () => {
      clearInterval(tick);
      clearInterval(save);
      // envia o que sobrou ao sair da página
      if (unsaved.current >= 5) logStudy(unsaved.current, activity);
    };
  }, [activity]);

  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-sm tabular-nums">
      ⏱️ {m}:{s}
    </span>
  );
}
