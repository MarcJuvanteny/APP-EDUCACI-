# Migracions

`schema.sql` ja no s'edita més — queda congelat com a foto de tot el que hi ha
aplicat a la base de dades de producció fins avui (útil per muntar un entorn
nou des de zero d'un sol cop).

A partir d'ara, cada canvi a l'esquema (taula nova, columna nova, canvi de
tipus, migració de dades...) és un fitxer nou en aquesta carpeta, no una
edició de `schema.sql`. Així es pot veure l'historial de canvis i mai cal
"recordar" quina part del fitxer gran ja s'ha executat i quina no.

## Convenció

- Nom del fitxer: `AAAA-MM-DD_descripcio-curta.sql` (p. ex.
  `2026-08-04_alumnes-comentaris-per-assignatura.sql`).
- Cada fitxer ha de ser idempotent (`if not exists` / `if exists`) igual que
  ja es feia a `schema.sql`, per si s'executa dues vegades per error.
- S'executen a mà, en ordre, des del SQL Editor de Supabase — igual que
  `schema.sql` fins ara. No cal instal·lar cap CLI.
- Un cop aplicat un fitxer a producció, no es torna a editar: si cal
  rectificar-lo, es crea un fitxer nou.
