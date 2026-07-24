"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Atualiza as preferências de exibição do usuário (romaji / furigana).
export async function updateDisplaySettings(settings: {
  show_romaji?: boolean;
  show_furigana?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const patch: Record<string, boolean> = {};
  if (typeof settings.show_romaji === "boolean")
    patch.show_romaji = settings.show_romaji;
  if (typeof settings.show_furigana === "boolean")
    patch.show_furigana = settings.show_furigana;
  if (Object.keys(patch).length === 0) return { ok: true };

  await supabase.from("profiles").update(patch).eq("id", user.id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// Define quais famílias de kana já foram ensinadas (método uma-por-dia).
export async function updateTaughtGroups(groups: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  // Mantém apenas strings, sem duplicatas.
  const clean = [...new Set(groups.filter((g) => typeof g === "string"))];
  await supabase
    .from("profiles")
    .update({ taught_groups: clean })
    .eq("id", user.id);
  revalidatePath("/", "layout");
  return { ok: true };
}

// Soma pontos ao usuário logado (usado ao concluir atividades de prática).
export async function awardPoints(amount: number) {
  const n = Math.max(0, Math.min(Math.round(amount), 50));
  if (n === 0) return { ok: true };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };
  await supabase.rpc("increment_points", { p_amount: n });
  return { ok: true };
}
