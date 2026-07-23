#!/usr/bin/env bash
# Copia de seguretat completa de la base de dades de Supabase (via pg_dump).
#
# El pla Free de Supabase no inclou backups automatics amb recuperacio puntual,
# aixi que aquest script es la xarxa de seguretat mentre el projecte hi sigui.
#
# US:
#   1. Instal·la el client de PostgreSQL si no el tens (inclou pg_dump):
#        Ubuntu/Debian: sudo apt install postgresql-client
#        macOS:         brew install libpq && brew link --force libpq
#   2. Exporta la cadena de connexio (Supabase Dashboard -> Project Settings ->
#      Database -> Connection string -> URI). NO la guardis mai al codi ni la
#      pugis a git:
#        export SUPABASE_DB_URL="postgresql://postgres:LA_TEVA_CONTRASENYA@db.XXXX.supabase.co:5432/postgres"
#   3. Executa: ./scripts/backup-supabase.sh
#
# Els fitxers es guarden a backups/ (ja exclosa de git al .gitignore). Aquesta
# carpeta conte dades reals d'alumnes menors — guarda-la nomes en un lloc amb
# acces restringit (mai en un disc compartit ni un servei nuvol sense xifrar),
# i esborra les copies que ja no calguin seguint la politica de retencio del centre.

set -euo pipefail

if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "Error: cal definir SUPABASE_DB_URL abans d'executar aquest script." >&2
  echo "Mira les instruccions al capçal d'aquest fitxer." >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "Error: pg_dump no esta instal·lat. Mira les instruccions al capçal d'aquest fitxer." >&2
  exit 1
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/backups"
mkdir -p "$DIR"

TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
FILE="$DIR/arrel-backup-$TIMESTAMP.sql.gz"

echo "Fent còpia de seguretat de la base de dades..."
pg_dump "$SUPABASE_DB_URL" --no-owner --no-privileges | gzip > "$FILE"

echo "Còpia desada a: $FILE"
echo "Recorda: aquest fitxer conté dades reals d'alumnes — guarda'l en un lloc segur i esborra'l quan ja no calgui."
