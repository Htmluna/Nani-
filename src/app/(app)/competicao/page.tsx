import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/format";
import GroupForms from "@/components/GroupForms";
import { leaveGroup } from "./actions";

interface RankRow {
  id: string;
  username: string;
  points: number;
  total_seconds: number;
  week_seconds: number;
}

export default async function CompeticaoPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group:groups(id, name, invite_code, owner_id)")
    .eq("user_id", profile.id);

  const groups =
    (memberships
      ?.map((m) => m.group)
      .filter(Boolean) as unknown as {
      id: string;
      name: string;
      invite_code: string;
      owner_id: string;
    }[]) ?? [];

  // Monta o ranking de cada grupo.
  const rankings = await Promise.all(
    groups.map(async (g) => {
      const { data: members } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", g.id);
      const ids = (members ?? []).map((m) => m.user_id);

      const { data: rows } = await supabase
        .from("study_ranking")
        .select("id, username, points, total_seconds, week_seconds")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
        .order("week_seconds", { ascending: false });

      return { group: g, rows: (rows ?? []) as RankRow[] };
    })
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-bold">Competição 🏆</h1>
      <p className="mt-1 text-[var(--muted)]">
        Crie ou entre em um grupo e veja quem estudou por mais tempo. O ranking
        usa o tempo registrado enquanto você estuda no app.
      </p>

      {rankings.length > 0 && (
        <div className="mt-6 space-y-6">
          {rankings.map(({ group, rows }) => (
            <div
              key={group.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{group.name}</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-lg bg-[var(--background)] px-3 py-1">
                    Convite:{" "}
                    <strong className="font-mono">{group.invite_code}</strong>
                  </span>
                  <form action={leaveGroup.bind(null, group.id)}>
                    <button className="rounded-lg border border-[var(--border)] px-3 py-1 hover:bg-[var(--background)]">
                      Sair
                    </button>
                  </form>
                </div>
              </div>

              <ol className="mt-4 space-y-2">
                {rows.map((r, idx) => (
                  <li
                    key={r.id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      r.id === profile.id
                        ? "bg-[var(--primary)]/10"
                        : "bg-[var(--background)]"
                    }`}
                  >
                    <span className="w-6 text-center text-lg">
                      {["🥇", "🥈", "🥉"][idx] ?? idx + 1}
                    </span>
                    <span className="flex-1 font-medium">
                      {r.username}
                      {r.id === profile.id && (
                        <span className="ml-1 text-xs text-[var(--muted)]">
                          (você)
                        </span>
                      )}
                    </span>
                    <span className="text-sm">
                      <span className="font-semibold">
                        {formatDuration(r.week_seconds)}
                      </span>
                      <span className="text-[var(--muted)]"> esta semana</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs text-[var(--muted)]">
                Ranking pelo tempo estudado nos últimos 7 dias.
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-3 font-semibold">
        {rankings.length ? "Entrar em outro grupo" : "Comece aqui"}
      </h2>
      <GroupForms />
    </div>
  );
}
