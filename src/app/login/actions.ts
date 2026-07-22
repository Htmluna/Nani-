"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "E-mail ou senha inválidos." };
  redirect("/painel");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (username.length < 2)
    return { error: "Escolha um nome de usuário com pelo menos 2 letras." };
  if (password.length < 6)
    return { error: "A senha precisa ter pelo menos 6 caracteres." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

  // Se a confirmação de e-mail estiver desativada, já dá pra logar.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError)
    return {
      message:
        "Conta criada! Confirme seu e-mail (se pedido) e faça login para começar.",
    };

  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
