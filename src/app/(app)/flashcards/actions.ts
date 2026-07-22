"use server";

import { createClient } from "@/lib/supabase/server";

// Intervalos (em horas) por caixa de Leitner 1..5.
const INTERVALS_H = [0, 8, 24, 72, 168, 336];

// Registra uma revisão de flashcard e atualiza a caixa/agendamento.
export async function reviewCard(cardId: string, correct: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: existing } = await supabase
    .from("flashcard_progress")
    .select("box, reviews")
    .eq("user_id", user.id)
    .eq("card_id", cardId)
    .maybeSingle();

  const currentBox = existing?.box ?? 1;
  const nextBox = correct
    ? Math.min(currentBox + 1, 5)
    : 1; // errou -> volta pra caixa 1

  const dueAt = new Date(
    Date.now() + INTERVALS_H[nextBox] * 3600 * 1000
  ).toISOString();

  await supabase.from("flashcard_progress").upsert(
    {
      user_id: user.id,
      card_id: cardId,
      box: nextBox,
      due_at: dueAt,
      reviews: (existing?.reviews ?? 0) + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,card_id" }
  );

  // +1 ponto por acerto, para incentivar a revisão.
  if (correct) {
    await supabase.rpc("increment_points", { p_amount: 1 });
  }

  return { ok: true, box: nextBox };
}
