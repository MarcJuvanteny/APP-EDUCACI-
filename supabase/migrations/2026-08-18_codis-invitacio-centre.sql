-- ═══════════════════════════════════════════════════════════════
-- Registre controlat en fase de proves: codi d'invitació per centre
-- ═══════════════════════════════════════════════════════════════
-- Cada centre rep un codi propi (creat a mà per l'administrador, veure
-- avall) amb un nombre màxim de professors que s'hi poden registrar. Sense
-- codi vàlid no es pot crear compte — evita que es registri qualsevol
-- persona mentre l'app està en fase de prova amb un grup reduït de centres.

-- ─── Taula de codis ───
-- No té CAP política de RLS (només "enable row level security", sense
-- "create policy"): amb RLS activat i zero polítiques, ni "anon" ni
-- "authenticated" hi poden accedir directament des del client — ni per
-- llegir-la ni per escriure-hi. L'única porta d'entrada és la funció
-- consumir_codi_centre() de sota (security definer), que sí pot saltar-se
-- la RLS. Des del Dashboard de Supabase (Table Editor / SQL Editor) es
-- continua veient i editant amb normalitat, perquè allà s'hi accedeix amb
-- privilegis complets, no a través de l'API amb la clau anònima.
create table if not exists codis_centre (
  codi text primary key,
  nom_centre text not null,
  limit_professors integer not null default 30,
  professors_registrats integer not null default 0,
  actiu boolean not null default true,
  created_at timestamptz not null default now()
);

alter table codis_centre enable row level security;

-- ─── Validar i "gastar" una plaça, de forma atòmica ───
-- Es fa amb un sol UPDATE ... RETURNING (no un SELECT seguit d'un UPDATE a
-- part) perquè si dos professors del mateix centre es registren al mateix
-- segon, Postgres serialitza les actualitzacions d'una mateixa fila — mai
-- poden superar tots dos alhora el límit_professors encara que hi hagi una
-- carrera entre les dues peticions.
-- Retorna una fila amb nom_centre si el codi és vàlid, actiu i li queden
-- places (i, en aquest mateix pas, ja incrementa el comptador). Retorna cap
-- fila si el codi no existeix, està desactivat o ja ha arribat al límit.
-- La comparació ignora majúscules/minúscules i espais als extrems perquè un
-- professor escrivint el codi a mà no el falli per un detall de format.
create or replace function public.consumir_codi_centre(p_codi text)
returns table(nom_centre text) as $$
begin
  return query
    update public.codis_centre c
    set professors_registrats = professors_registrats + 1
    where upper(c.codi) = upper(trim(p_codi))
      and c.actiu
      and c.professors_registrats < c.limit_professors
    returning c.nom_centre;
end;
$$ language plpgsql security definer set search_path = public;

-- Cal el grant explícit perquè el registre (encara sense sessió — l'usuari
-- encara no té compte en aquest punt) pugui cridar la funció com a "anon".
grant execute on function public.consumir_codi_centre(text) to anon, authenticated;

-- ─── Deixar constància de quin codi ha fet servir cada professor ───
-- Auditoria senzilla (a més del comptador de la taula de codis): permet
-- veure des del Table Editor quin centre/codi té cada compte, per si cal
-- investigar o corregir algun cas concret.
alter table profiles add column if not exists codi_centre text not null default '';

-- ─── El trigger de creació de compte ara també guarda centre i codi ───
-- consumir_codi_centre() ja ha validat el codi ABANS de crear el compte
-- (des del client, veure registrarCompte() a public/quadern.js) — aquí
-- només es desa el nom del centre i el codi que ha arribat com a metadata
-- del signUp, perquè el professor no l'hagi de tornar a escriure al pas
-- de "Configura el teu perfil".
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom, centre, codi_centre)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', ''),
    coalesce(new.raw_user_meta_data->>'centre', ''),
    coalesce(new.raw_user_meta_data->>'codi_centre', '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- ─── Exemple per crear un codi nou (executar a mà al SQL Editor) ───
-- insert into codis_centre (codi, nom_centre, limit_professors)
-- values ('PINETONS26', 'Escola Pinetons', 30);
