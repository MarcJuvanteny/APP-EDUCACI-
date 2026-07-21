-- ═══════════════════════════════════════════════════════════════
-- Arrel — esquema inicial de base de dades
-- Executar sencer una vegada al SQL Editor de Supabase (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── PERFIL DEL PROFESSOR ───
-- auth.users ja el gestiona Supabase (email, contrasenya...). Aqui nomes guardem
-- les dades extra (nom, centre, any escolar) que ja existien a l'app.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null default '',
  centre text not null default '',
  any_escolar text not null default '',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "El professor nomes veu i edita el seu propi perfil" on profiles;
create policy "El professor nomes veu i edita el seu propi perfil"
  on profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

-- ─── CURSOS ───
create table if not exists cursos (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references auth.users(id) on delete cascade,
  nom text not null,
  created_at timestamptz not null default now()
);

alter table cursos enable row level security;

drop policy if exists "El professor nomes veu i edita els seus propis cursos" on cursos;
create policy "El professor nomes veu i edita els seus propis cursos"
  on cursos for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── ASSIGNATURES (per curs) ───
create table if not exists assignatures (
  id uuid primary key default gen_random_uuid(),
  curs_id uuid not null references cursos(id) on delete cascade,
  professor_id uuid not null references auth.users(id) on delete cascade,
  nom text not null,
  created_at timestamptz not null default now()
);

alter table assignatures enable row level security;

drop policy if exists "El professor nomes veu i edita les seves assignatures" on assignatures;
create policy "El professor nomes veu i edita les seves assignatures"
  on assignatures for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── ALUMNES ───
-- "ordre" es la posicio dins la llista de classe (1, 2, 3...) — es el que
-- s'utilitza per identificar a un alumne entre fitxers de diferents professors
-- a l'hora de generar l'informe conjunt (no el nom, per evitar coincidencies).
create table if not exists alumnes (
  id uuid primary key default gen_random_uuid(),
  curs_id uuid not null references cursos(id) on delete cascade,
  professor_id uuid not null references auth.users(id) on delete cascade,
  nom text not null,
  ordre integer not null,
  comentari text not null default '',
  created_at timestamptz not null default now()
);

alter table alumnes enable row level security;

drop policy if exists "El professor nomes veu i edita els seus alumnes" on alumnes;
create policy "El professor nomes veu i edita els seus alumnes"
  on alumnes for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── ACTIVITATS I NOTES ───
-- "notes" guarda {alumne_id: {criteri: valor}} i "comentaris" {alumne_id: text},
-- igual que ja es feia amb localStorage. Es JSONB perque el nombre de criteris
-- varia per competencia i encara no tenim la rubrica definitiva de totes les
-- assignatures — es pot normalitzar mes endavant sense trencar res de fora.
create table if not exists activitats (
  id uuid primary key default gen_random_uuid(),
  curs_id uuid not null references cursos(id) on delete cascade,
  assignatura_id uuid not null references assignatures(id) on delete cascade,
  professor_id uuid not null references auth.users(id) on delete cascade,
  competencia_id text not null,
  trimestre text not null,
  nom text not null,
  data date,
  hora text,
  notes jsonb not null default '{}'::jsonb,
  comentaris jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table activitats enable row level security;

drop policy if exists "El professor nomes veu i edita les seves activitats" on activitats;
create policy "El professor nomes veu i edita les seves activitats"
  on activitats for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── RÚBRICA PERSONALITZADA ───
-- Nomes guarda els canvis que el professor fa sobre la rubrica per defecte
-- (criteris afegits/editats). Es refinara quan tinguem la rubrica completa.
create table if not exists rubrica_custom (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references auth.users(id) on delete cascade,
  competencia_id text not null,
  criteris jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (professor_id, competencia_id)
);

alter table rubrica_custom enable row level security;

drop policy if exists "El professor nomes veu i edita la seva rubrica" on rubrica_custom;
create policy "El professor nomes veu i edita la seva rubrica"
  on rubrica_custom for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── EVENTS DE CALENDARI (Programació) ───
create table if not exists cal_events (
  id uuid primary key default gen_random_uuid(),
  curs_id uuid references cursos(id) on delete cascade,
  professor_id uuid not null references auth.users(id) on delete cascade,
  titol text not null,
  data date not null,
  data_fi date,
  hora text,
  tipus text not null default 'clay',
  origen text not null default 'manual',
  nota text not null default '',
  created_at timestamptz not null default now()
);

alter table cal_events enable row level security;

drop policy if exists "El professor nomes veu i edita els seus events" on cal_events;
create policy "El professor nomes veu i edita els seus events"
  on cal_events for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

-- ─── Crear el perfil automaticament quan algu es registra ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom', ''));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Ampliacio de cal_events per al calendari setmanal de Programació ───
-- El calendari mostra un horari recurrent (dia de la setmana + franja horaria),
-- no sempre una data concreta, i el curs es nomes una etiqueta de text (el
-- component encara no fa servir curs_id de veritat). "data" passa a ser opcional.
alter table cal_events alter column data drop not null;
alter table cal_events add column if not exists dia_setmana integer;
alter table cal_events add column if not exists franja_hora integer;
alter table cal_events add column if not exists curs_nom text;
