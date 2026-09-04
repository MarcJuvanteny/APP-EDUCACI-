-- ═══════════════════════════════════════════════════════════════
-- Sistema multi-nivell: preparar la base de dades per unificar-hi
-- tres apps (primària, ESO, infantil) reduint-ho a un sol projecte
-- de Supabase, amb una barrera real via RLS entre nivells.
--
-- IMPORTANT — aquest fitxer NOMÉS AFEGEIX. No hi ha cap DROP TABLE,
-- DELETE ni UPDATE que toqui dades existents. L'única cosa que
-- passa a les files ja existents és que la columna nova "nivell"
-- els queda com 'primaria' (via el DEFAULT), tal com es volia.
--
-- Executar sencer, d'un sol cop, al SQL Editor de Supabase. Es
-- idempotent (es pot tornar a executar sense trencar res).
-- ═══════════════════════════════════════════════════════════════

begin;

-- ─── PAS 1: columna "nivell" a totes les taules (aditiu) ───
alter table profiles           add column if not exists nivell text not null default 'primaria';
alter table cursos             add column if not exists nivell text not null default 'primaria';
alter table assignatures       add column if not exists nivell text not null default 'primaria';
alter table alumnes            add column if not exists nivell text not null default 'primaria';
alter table activitats         add column if not exists nivell text not null default 'primaria';
alter table rubrica_custom     add column if not exists nivell text not null default 'primaria';
alter table cal_events         add column if not exists nivell text not null default 'primaria';
alter table informes_generats  add column if not exists nivell text not null default 'primaria';
alter table codis_centre       add column if not exists nivell text not null default 'primaria';

-- ─── PAS 2: nomes valors valids (aditiu) ───
alter table profiles           add constraint if not exists profiles_nivell_check          check (nivell in ('primaria','eso','infantil'));
alter table cursos             add constraint if not exists cursos_nivell_check            check (nivell in ('primaria','eso','infantil'));
alter table assignatures       add constraint if not exists assignatures_nivell_check      check (nivell in ('primaria','eso','infantil'));
alter table alumnes            add constraint if not exists alumnes_nivell_check           check (nivell in ('primaria','eso','infantil'));
alter table activitats         add constraint if not exists activitats_nivell_check        check (nivell in ('primaria','eso','infantil'));
alter table rubrica_custom     add constraint if not exists rubrica_custom_nivell_check    check (nivell in ('primaria','eso','infantil'));
alter table cal_events         add constraint if not exists cal_events_nivell_check        check (nivell in ('primaria','eso','infantil'));
alter table informes_generats  add constraint if not exists informes_generats_nivell_check check (nivell in ('primaria','eso','infantil'));
alter table codis_centre       add constraint if not exists codis_centre_nivell_check      check (nivell in ('primaria','eso','infantil'));

-- ─── PAS 3: el nivell de cada fila es deriva SEMPRE del perfil del ───
-- professor propietari — mai el fixa el client. S'aplica a cada INSERT
-- i cada UPDATE, així que ni un bug al codi de cap de les 3 apps pot
-- "colar" una fila amb el nivell equivocat.
create or replace function public.stamp_nivell_des_del_perfil()
returns trigger as $$
begin
  select nivell into new.nivell from public.profiles where id = new.professor_id;
  if new.nivell is null then
    raise exception 'No es pot determinar el nivell: professor_id % no te perfil', new.professor_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

do $$
declare taula text;
begin
  foreach taula in array array['cursos','assignatures','alumnes','activitats','rubrica_custom','cal_events','informes_generats'] loop
    execute format('drop trigger if exists trg_stamp_nivell on %I', taula);
    execute format('create trigger trg_stamp_nivell before insert or update on %I for each row execute function public.stamp_nivell_des_del_perfil()', taula);
  end loop;
end $$;

-- ─── PAS 4: el professor no pot canviar-se el seu propi nivell ───
-- Sense aixo, algu podria trucar directament a l'API REST (saltant-se
-- l'app) i fer un UPDATE profiles SET nivell=... — la RLS de profiles
-- nomes comprova la fila (id=auth.uid()), no quines columnes es toquen.
create or replace function public.bloquejar_canvi_nivell()
returns trigger as $$
begin
  new.nivell := old.nivell;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists trg_bloquejar_canvi_nivell on profiles;
create trigger trg_bloquejar_canvi_nivell before update on profiles
  for each row execute function public.bloquejar_canvi_nivell();

-- ─── PAS 5: RLS — segona barrera independent, per taula ───
-- Substitueix cada politica existent per exigir, a mes del ja existent
-- "professor_id = auth.uid()", que el nivell de la fila coincideixi
-- amb el nivell del propi perfil autenticat. Com el trigger del PAS 3
-- ja garanteix que el nivell sempre es correcte, aquesta condicio mai
-- hauria de bloquejar una operacio legitima — es una segona pany
-- independent per si el trigger algun dia es trenca o falta.
create or replace function public.nivell_actual()
returns text as $$
  select nivell from public.profiles where id = auth.uid();
$$ language sql security definer stable set search_path = public;

drop policy if exists "El professor nomes veu i edita els seus propis cursos" on cursos;
create policy "El professor nomes veu i edita els seus propis cursos"
  on cursos for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i edita les seves assignatures" on assignatures;
create policy "El professor nomes veu i edita les seves assignatures"
  on assignatures for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i edita els seus alumnes" on alumnes;
create policy "El professor nomes veu i edita els seus alumnes"
  on alumnes for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i edita les seves activitats" on activitats;
create policy "El professor nomes veu i edita les seves activitats"
  on activitats for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i edita la seva rubrica" on rubrica_custom;
create policy "El professor nomes veu i edita la seva rubrica"
  on rubrica_custom for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i edita els seus events" on cal_events;
create policy "El professor nomes veu i edita els seus events"
  on cal_events for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

drop policy if exists "El professor nomes veu i crea els seus propis informes" on informes_generats;
create policy "El professor nomes veu i crea els seus propis informes"
  on informes_generats for all
  using (professor_id = auth.uid() and nivell = public.nivell_actual())
  with check (professor_id = auth.uid() and nivell = public.nivell_actual());

-- profiles NO necessita aquesta segona condicio: ja esta perfectament
-- aillat amb "id = auth.uid()" (cada professor nomes te UNA fila, la
-- seva), i el nivell alla es la font de veritat, no una copia a validar.

-- ─── PAS 6: codis_centre — els codis d'invitacio tambe queden per nivell ───
-- El "default 'primaria'" manté compatible qualsevol crida antiga
-- mentre s'actualitza el codi (aixo ja ho fa aquest mateix commit).
create or replace function public.consumir_codi_centre(p_codi text, p_nivell text default 'primaria')
returns table(nom_centre text) as $$
begin
  return query
    update public.codis_centre c
    set professors_registrats = professors_registrats + 1
    where upper(c.codi) = upper(trim(p_codi))
      and c.nivell = p_nivell
      and c.actiu
      and c.professors_registrats < c.limit_professors
    returning c.nom_centre;
end;
$$ language plpgsql security definer set search_path = public;

-- ─── PAS 7: handle_new_user — guarda el nivell rebut al registrar-se ───
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom, centre, codi_centre, nivell)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', ''),
    coalesce(new.raw_user_meta_data->>'centre', ''),
    coalesce(new.raw_user_meta_data->>'codi_centre', ''),
    coalesce(new.raw_user_meta_data->>'nivell', 'primaria')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

commit;

-- ─── Comprovacio rapida despres d'executar ───
-- select nivell, count(*) from alumnes group by nivell;
-- (hauria de sortir tot com 'primaria', ja que encara no hi ha cap
-- altra app connectada a aquesta base de dades)
