import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AskForm from "@/components/AskForm";
import AnswerForm from "@/components/AnswerForm";

interface QuestionRow {
  id: string;
  prompt: string;
  correct_answer: string;
  points: number;
  status: string;
  given_answer: string | null;
  is_correct: boolean | null;
  asker_id: string;
  target_id: string;
  asker: { username: string } | null;
  target: { username: string } | null;
}

export default async function PerguntasPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  // Candidatos = membros dos meus grupos (menos eu).
  const { data: myGroups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", profile.id);
  const groupIds = (myGroups ?? []).map((g) => g.group_id);

  let candidates: { id: string; username: string }[] = [];
  if (groupIds.length) {
    const { data: members } = await supabase
      .from("group_members")
      .select("user_id, profiles(id, username)")
      .in("group_id", groupIds);
    const map = new Map<string, string>();
    for (const m of members ?? []) {
      const p = m.profiles as unknown as { id: string; username: string } | null;
      if (p && p.id !== profile.id) map.set(p.id, p.username);
    }
    candidates = [...map].map(([id, username]) => ({ id, username }));
  }

  const select =
    "id, prompt, correct_answer, points, status, given_answer, is_correct, asker_id, target_id, " +
    "asker:profiles!questions_asker_id_fkey(username), target:profiles!questions_target_id_fkey(username)";

  const [{ data: received }, { data: sent }] = await Promise.all([
    supabase
      .from("questions")
      .select(select)
      .eq("target_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("questions")
      .select(select)
      .eq("asker_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const receivedRows = (received ?? []) as unknown as QuestionRow[];
  const sentRows = (sent ?? []) as unknown as QuestionRow[];
  const pending = receivedRows.filter((q) => q.status === "pendente");
  const answeredReceived = receivedRows.filter((q) => q.status !== "pendente");

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Perguntas ❓</h1>
      <p className="mt-1 text-[var(--muted)]">
        Desafie um amigo com uma pergunta de japonês. Se ele acertar, vocês dois
        ganham os pontos!
      </p>

      <h2 className="mt-6 mb-3 font-semibold">Nova pergunta</h2>
      <AskForm candidates={candidates} />

      <h2 className="mt-8 mb-3 font-semibold">
        Para você responder{" "}
        {pending.length > 0 && (
          <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-[var(--primary-foreground)]">
            {pending.length}
          </span>
        )}
      </h2>
      {pending.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Nenhuma pergunta pendente. 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {pending.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">
                  De <strong>{q.asker?.username ?? "alguém"}</strong>
                </span>
                <span className="rounded-full bg-[var(--background)] px-2 py-0.5">
                  vale {q.points} pts
                </span>
              </div>
              <p className="mb-3 text-lg">{q.prompt}</p>
              <AnswerForm questionId={q.id} points={q.points} />
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-3 font-semibold">Perguntas que enviei</h2>
      {sentRows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          Você ainda não enviou perguntas.
        </p>
      ) : (
        <div className="space-y-2">
          {sentRows.map((q) => (
            <HistoryItem
              key={q.id}
              prompt={q.prompt}
              who={`para ${q.target?.username ?? "alguém"}`}
              status={q.status}
              isCorrect={q.is_correct}
              points={q.points}
            />
          ))}
        </div>
      )}

      {answeredReceived.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 font-semibold">Perguntas que respondi</h2>
          <div className="space-y-2">
            {answeredReceived.map((q) => (
              <HistoryItem
                key={q.id}
                prompt={q.prompt}
                who={`de ${q.asker?.username ?? "alguém"}`}
                status={q.status}
                isCorrect={q.is_correct}
                points={q.points}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HistoryItem({
  prompt,
  who,
  status,
  isCorrect,
  points,
}: {
  prompt: string;
  who: string;
  status: string;
  isCorrect: boolean | null;
  points: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate">{prompt}</p>
        <p className="text-xs text-[var(--muted)]">{who}</p>
      </div>
      <span className="shrink-0 text-sm">
        {status === "pendente" ? (
          <span className="text-[var(--muted)]">⏳ pendente</span>
        ) : isCorrect ? (
          <span className="text-green-600">✅ +{points}</span>
        ) : (
          <span className="text-red-600">❌ errou</span>
        )}
      </span>
    </div>
  );
}
