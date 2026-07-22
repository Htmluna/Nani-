"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AskState {
  error?: string;
  message?: string;
}

export async function askQuestion(
  _prev: AskState,
  formData: FormData
): Promise<AskState> {
  const targetId = String(formData.get("target_id") ?? "");
  const prompt = String(formData.get("prompt") ?? "").trim();
  const correct = String(formData.get("correct_answer") ?? "").trim();
  const points = Math.max(
    1,
    Math.min(100, Number(formData.get("points") ?? 10))
  );

  if (!targetId) return { error: "Escolha para quem enviar." };
  if (prompt.length < 3) return { error: "Escreva a pergunta." };
  if (!correct) return { error: "Informe a resposta correta." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Faça login novamente." };
  if (targetId === user.id)
    return { error: "Você não pode enviar uma pergunta para si mesmo." };

  const { error } = await supabase.from("questions").insert({
    asker_id: user.id,
    target_id: targetId,
    prompt,
    correct_answer: correct,
    points,
  });

  if (error) return { error: "Não foi possível enviar a pergunta." };

  revalidatePath("/perguntas");
  return { message: "Pergunta enviada! 🎌" };
}

export async function answerQuestion(questionId: string, answer: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("answer_question", {
    p_question_id: questionId,
    p_answer: answer,
  });

  revalidatePath("/perguntas");
  revalidatePath("/painel");

  if (error) return { ok: false, error: error.message };
  return { ok: true, correct: data?.is_correct as boolean };
}
