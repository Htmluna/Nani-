"use server";

import { createClient } from "@/lib/supabase/server";

// Registra tempo de estudo (em segundos) para o ranking de competição.
export async function logStudy(seconds: number, activity: string) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  const secs = Math.min(Math.round(seconds), 3600); // limite de 1h por envio

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("study_sessions").insert({
    user_id: user.id,
    seconds: secs,
    activity,
  });
}
