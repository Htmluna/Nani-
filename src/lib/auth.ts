import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  username: string;
  jlpt_level: "N5" | "N4" | "N3" | "N2" | "N1";
  points: number;
  streak: number;
  // Preferências de exibição (sincronizadas na conta).
  show_romaji: boolean;
  show_furigana: boolean;
  // Famílias de kana já ensinadas (chaves de grupo, ex.: "vogais", "k").
  taught_groups: string[];
}

// Usamos "*" (e não a lista de colunas) de propósito: assim, se o banco ainda
// não tiver as colunas novas (migração não aplicada), a query NÃO falha — só
// vêm menos campos, e o normalize preenche os padrões.
function normalize(
  row: Record<string, unknown> | null,
  fallbackId: string,
  fallbackUsername: string
): Profile {
  const p = (row ?? {}) as Partial<Profile>;
  return {
    id: (p.id as string) ?? fallbackId,
    username: (p.username as string) ?? fallbackUsername,
    jlpt_level: (p.jlpt_level ?? "N5") as Profile["jlpt_level"],
    points: (p.points as number) ?? 0,
    streak: (p.streak as number) ?? 0,
    show_romaji: p.show_romaji ?? true,
    show_furigana: p.show_furigana ?? true,
    taught_groups: p.taught_groups ?? ["vogais"],
  };
}

// Retorna o usuário logado + perfil, ou redireciona pro login.
export async function requireProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const username = user.email?.split("@")[0] ?? "usuario";

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Caso o trigger ainda não tenha criado o perfil, cria na hora.
  if (!profile) {
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: user.id, username })
      .select("*")
      .maybeSingle();
    return normalize(created ?? null, user.id, username);
  }

  return normalize(profile as Record<string, unknown>, user.id, username);
}
