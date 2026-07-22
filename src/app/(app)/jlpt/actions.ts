"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { jlptLevels, type JlptLevel } from "@/data/jlpt";

// Define o nível JLPT atual do usuário.
export async function setLevel(level: string) {
  if (!jlptLevels.includes(level as JlptLevel)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ jlpt_level: level })
    .eq("id", user.id);

  revalidatePath("/jlpt");
  revalidatePath("/painel");
}
