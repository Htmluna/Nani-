-- =====================================================================
-- Nani?! — Schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no painel do Supabase > SQL Editor > New query
-- =====================================================================

-- ---------------------------------------------------------------------
-- PERFIS
-- Cada usuário do Supabase Auth ganha uma linha em profiles.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text unique not null,
  jlpt_level  text not null default 'N5' check (jlpt_level in ('N5','N4','N3','N2','N1')),
  points      integer not null default 0,
  streak      integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Preferências de exibição e progresso do método "uma família por dia".
-- (Colunas adicionadas depois; add column if not exists é seguro de reexecutar.)
alter table public.profiles
  add column if not exists show_romaji   boolean not null default true,
  add column if not exists show_furigana boolean not null default true,
  add column if not exists taught_groups text[]  not null default array['vogais']::text[];

alter table public.profiles enable row level security;

drop policy if exists "perfis visíveis a todos autenticados" on public.profiles;
create policy "perfis visíveis a todos autenticados"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "usuário edita o próprio perfil" on public.profiles;
create policy "usuário edita o próprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists "usuário cria o próprio perfil" on public.profiles;
create policy "usuário cria o próprio perfil"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Cria o perfil automaticamente ao registrar um usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- SESSÕES DE ESTUDO (cronômetro / ranking de tempo)
-- ---------------------------------------------------------------------
create table if not exists public.study_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  seconds       integer not null check (seconds >= 0),
  activity      text not null default 'estudo', -- 'kana' | 'flashcards' | 'jlpt' | ...
  studied_at    timestamptz not null default now()
);

alter table public.study_sessions enable row level security;

drop policy if exists "ler sessões de membros do meu grupo" on public.study_sessions;
create policy "ler sessões de membros do meu grupo"
  on public.study_sessions for select
  to authenticated
  using (true);

drop policy if exists "inserir minhas sessões" on public.study_sessions;
create policy "inserir minhas sessões"
  on public.study_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- GRUPOS DE COMPETIÇÃO
-- ---------------------------------------------------------------------
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id   uuid not null references public.groups (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "ver grupos" on public.groups;
create policy "ver grupos" on public.groups for select to authenticated using (true);

drop policy if exists "criar grupo" on public.groups;
create policy "criar grupo" on public.groups for insert to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "ver membros" on public.group_members;
create policy "ver membros" on public.group_members for select to authenticated using (true);

drop policy if exists "entrar no grupo" on public.group_members;
create policy "entrar no grupo" on public.group_members for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "sair do grupo" on public.group_members;
create policy "sair do grupo" on public.group_members for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- PERGUNTAS ENTRE USUÁRIOS (eu pergunto, ele responde e ganha pontos)
-- ---------------------------------------------------------------------
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  asker_id      uuid not null references public.profiles (id) on delete cascade,
  target_id     uuid not null references public.profiles (id) on delete cascade,
  prompt        text not null,                 -- a pergunta
  correct_answer text not null,                -- resposta correta (o autor define)
  points        integer not null default 10,   -- pontos em jogo
  status        text not null default 'pendente'
                  check (status in ('pendente','respondida')),
  given_answer  text,                          -- resposta que o alvo deu
  is_correct    boolean,                       -- se acertou
  created_at    timestamptz not null default now(),
  answered_at   timestamptz
);

alter table public.questions enable row level security;

drop policy if exists "ver perguntas que envolvem o usuário" on public.questions;
create policy "ver perguntas que envolvem o usuário"
  on public.questions for select to authenticated
  using (auth.uid() = asker_id or auth.uid() = target_id);

drop policy if exists "criar pergunta" on public.questions;
create policy "criar pergunta" on public.questions for insert to authenticated
  with check (auth.uid() = asker_id);

drop policy if exists "alvo responde a pergunta" on public.questions;
create policy "alvo responde a pergunta" on public.questions for update to authenticated
  using (auth.uid() = target_id);

-- ---------------------------------------------------------------------
-- PROGRESSO DE FLASHCARDS (repetição espaçada simples)
-- card_id é uma string estável vinda do conteúdo (ex.: "kana:あ", "jlpt:N5:水")
-- ---------------------------------------------------------------------
create table if not exists public.flashcard_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  card_id       text not null,
  box           integer not null default 1,    -- caixa de Leitner (1..5)
  due_at        timestamptz not null default now(),
  reviews       integer not null default 0,
  updated_at    timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.flashcard_progress enable row level security;

drop policy if exists "gerenciar meu progresso" on public.flashcard_progress;
create policy "gerenciar meu progresso"
  on public.flashcard_progress for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- FUNÇÃO: responder pergunta de forma atômica (define pontos dos dois lados)
-- Autor (asker) ganha pontos se o alvo acertar; alvo ganha os pontos ao acertar.
-- ---------------------------------------------------------------------
create or replace function public.answer_question(
  p_question_id uuid,
  p_answer      text
)
returns public.questions
language plpgsql
security definer set search_path = public
as $$
declare
  q public.questions;
  v_correct boolean;
begin
  select * into q from public.questions where id = p_question_id for update;

  if q is null then
    raise exception 'Pergunta não encontrada';
  end if;
  if q.target_id <> auth.uid() then
    raise exception 'Você não é o destinatário desta pergunta';
  end if;
  if q.status = 'respondida' then
    raise exception 'Pergunta já respondida';
  end if;

  -- comparação simples e tolerante (sem espaços/caixa)
  v_correct := lower(trim(p_answer)) = lower(trim(q.correct_answer));

  update public.questions
    set given_answer = p_answer,
        is_correct   = v_correct,
        status       = 'respondida',
        answered_at  = now()
    where id = p_question_id
    returning * into q;

  if v_correct then
    update public.profiles set points = points + q.points where id = q.target_id;
    update public.profiles set points = points + q.points where id = q.asker_id;
  end if;

  return q;
end;
$$;

-- ---------------------------------------------------------------------
-- FUNÇÃO: somar pontos ao usuário logado de forma atômica
-- ---------------------------------------------------------------------
create or replace function public.increment_points(p_amount integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
    set points = points + p_amount
    where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------
-- VIEW: ranking por tempo de estudo (total e últimos 7 dias)
-- ---------------------------------------------------------------------
create or replace view public.study_ranking as
select
  p.id,
  p.username,
  p.points,
  coalesce(sum(s.seconds), 0)::bigint as total_seconds,
  coalesce(sum(s.seconds) filter (where s.studied_at > now() - interval '7 days'), 0)::bigint as week_seconds
from public.profiles p
left join public.study_sessions s on s.user_id = p.id
group by p.id, p.username, p.points;
