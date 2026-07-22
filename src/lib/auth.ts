import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  username: string;
  jlpt_level: "N5" | "N4" | "N3" | "N2" | "N1";
  points: number;
  streak: number;
}

// Retorna o usuário logado + perfil, ou redireciona pro login.
export async function requireProfile(): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, jlpt_level, points, streak")
    .eq("id", user.id)
    .single();

  // Caso o trigger ainda não tenha criado o perfil, cria na hora.
  if (!profile) {
    const username = user.email?.split("@")[0] ?? "usuario";
    const { data: created } = await supabase
      .from("profiles")
      .insert({ id: user.id, username })
      .select("id, username, jlpt_level, points, streak")
      .single();
    return created as Profile;
  }

  return profile as Profile;
}
