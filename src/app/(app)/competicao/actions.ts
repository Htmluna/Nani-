"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface GroupState {
  error?: string;
  message?: string;
}

export async function createGroup(
  _prev: GroupState,
  formData: FormData
): Promise<GroupState> {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Dê um nome ao grupo." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Faça login novamente." };

  const { data: group, error } = await supabase
    .from("groups")
    .insert({ name, owner_id: user.id })
    .select("id")
    .single();

  if (error || !group) return { error: "Não foi possível criar o grupo." };

  await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: user.id });

  revalidatePath("/competicao");
  return { message: "Grupo criado!" };
}

export async function joinGroup(
  _prev: GroupState,
  formData: FormData
): Promise<GroupState> {
  const code = String(formData.get("code") ?? "")
    .trim()
    .toLowerCase();
  if (!code) return { error: "Informe o código do convite." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Faça login novamente." };

  const { data: group } = await supabase
    .from("groups")
    .select("id")
    .eq("invite_code", code)
    .maybeSingle();

  if (!group) return { error: "Código não encontrado." };

  const { error } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: user.id });

  if (error) return { error: "Você já está neste grupo." };

  revalidatePath("/competicao");
  return { message: "Você entrou no grupo!" };
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  revalidatePath("/competicao");
}
