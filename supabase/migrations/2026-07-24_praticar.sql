-- =====================================================================
-- Migração: modos de prática + preferências de exibição
-- Rode este bloco no Supabase > SQL Editor caso o banco já exista.
-- (Se você recriar tudo pelo schema.sql, estas colunas já vêm juntas.)
-- =====================================================================

alter table public.profiles
  add column if not exists show_romaji   boolean not null default true,
  add column if not exists show_furigana boolean not null default true,
  add column if not exists taught_groups text[]  not null default array['vogais']::text[];
