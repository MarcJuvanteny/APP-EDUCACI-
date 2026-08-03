-- ═══════════════════════════════════════════════════════════════
-- Backfill de dades antigues (comptes creats abans de certes funcionalitats)
--
-- Per que cal aixo: el codi es una unica versio per a tothom, pero les dades
-- de cada compte son historial acumulat. Quan s'ha afegit una columna nova
-- (dia_setmana, franja_hora...) nomes les files noves l'omplen — les files
-- antigues es queden amb NULL, i el codi actual no sempre preveu aquest cas.
-- Aixo explica per que comptes diferents fallen de maneres diferents: cada
-- un arrossega un tros d'historial distint.
--
-- Executar sencer una vegada al SQL Editor de Supabase (o via psql amb
-- SUPABASE_DB_URL, igual que schema.sql). Es idempotent: es pot tornar a
-- executar sense fer mal, nomes toca les files que encara falten per arreglar.
-- ═══════════════════════════════════════════════════════════════

begin;

-- ─── 1) Events antics del calendari (Programació) sense dia_setmana/franja_hora ───
-- Abans d'existir el calendari setmanal, "cal_events" nomes guardava una
-- data concreta + "hora" en text lliure (p.ex. "10:00", "10.30", "10h").
-- Aqui deduim dia_setmana a partir de "data" (0=Dilluns...4=Divendres, igual
-- que DIES a weekly-calendar.jsx) i franja_hora a partir de "hora" (franges
-- de 30 min entre les 8:00 i les 17:00, igual que HORES a weekly-calendar.jsx).

-- 1a) dia_setmana — nomes dies feiners (cap de setmana es queda NULL, no hi
-- ha franja per mostrar-los i tocaria revisar-los a ma).
update cal_events
set dia_setmana = case extract(isodow from data)::int
                    when 1 then 0  -- Dilluns
                    when 2 then 1  -- Dimarts
                    when 3 then 2  -- Dimecres
                    when 4 then 3  -- Dijous
                    when 5 then 4  -- Divendres
                    else null      -- Dissabte/Diumenge — no aplica
                  end
where dia_setmana is null
  and data is not null
  and extract(isodow from data)::int between 1 and 5;

-- 1b) franja_hora — parseja "10:00", "10.00", "10h", "10h30", "1030"... a
-- minuts des de mitjanit i ho arrodoneix a la franja de 30 min mes propera.
-- Si no es pot interpretar, es queda NULL (caldra revisar-ho a ma).
with parsed as (
  select
    id,
    (regexp_match(trim(hora), '^(\d{1,2})\s*[:hH.]?\s*(\d{0,2})'))[1]::int as h,
    nullif((regexp_match(trim(hora), '^(\d{1,2})\s*[:hH.]?\s*(\d{0,2})'))[2], '')::int as m
  from cal_events
  where franja_hora is null
    and hora is not null
    and trim(hora) <> ''
)
update cal_events e
set franja_hora = greatest(0, least(17, round(((p.h * 60 + coalesce(p.m, 0)) - 480) / 30.0)::int))
from parsed p
where e.id = p.id
  and p.h is not null
  and p.h between 0 and 23;

-- 1c) nota — el formulari antic guardava el text a "titol"; el nou nomes fa
-- servir "nota". Si "nota" es buida pero "titol" te contingut, el copiem.
update cal_events
set nota = titol
where (nota is null or trim(nota) = '')
  and titol is not null
  and trim(titol) <> '';

-- ─── 2) Accents incorrectes en noms d'assignatura/curs desats abans del fix ───
-- Compara sense accents/majuscules contra la llista canonica de
-- public/quadern.js (assignaturesList) i corregeix nomes si coincideix
-- exactament un cop treus accents — mai toca noms que el professor s'ha
-- inventat (p.ex. "Robotica de 5e") perque aquests no encaixen amb la llista.
create extension if not exists unaccent;

with canonic (nom) as (
  values
    ('Català'), ('Castellà'), ('Anglès'), ('Matemàtiques'), ('Medi'),
    ('Música'), ('Ed. Física'), ('Arts'), ('Valors'),
    ('Competències transversals')
)
update assignatures a
set nom = c.nom
from canonic c
where lower(unaccent(a.nom)) = lower(unaccent(c.nom))
  and a.nom <> c.nom;

with canonic (nom) as (
  values
    ('Català'), ('Castellà'), ('Anglès'), ('Matemàtiques'), ('Medi'),
    ('Música'), ('Ed. Física'), ('Arts'), ('Valors'),
    ('Competències transversals')
)
update cursos u
set nom = c.nom
from canonic c
where lower(unaccent(u.nom)) = lower(unaccent(c.nom))
  and u.nom <> c.nom;

commit;

-- ─── Comprovacio ràpida despres d'executar ───
-- select count(*) filter (where dia_setmana is null) as sense_dia,
--        count(*) filter (where franja_hora is null) as sense_franja
-- from cal_events where data is not null;
