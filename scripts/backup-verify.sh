#!/usr/bin/env bash
set -euo pipefail
umask 077
project_dir="$(cd "$(dirname "$0")/.." && pwd)"
backup_dir="${TATTOO_BACKUP_DIR:-/opt/tattoo-office-secrets/backups}"
mkdir -p "$backup_dir"
container="$(docker compose --project-directory "$project_dir" -f "$project_dir/beget.compose.yaml" ps -q db)"
[[ -n "$container" ]] || { echo 'Tattoo Office database is unavailable' >&2; exit 1; }
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive="$backup_dir/tattoo-office-$stamp.dump"
scratch="tattoo_verify_$(date -u +%Y%m%d%H%M%S)_$$"
[[ "$scratch" =~ ^tattoo_verify_[0-9_]+$ ]] || exit 1
created=0
cleanup() { if [[ "$created" == 1 ]]; then docker exec "$container" dropdb -U tattoo_office --if-exists "$scratch" >/dev/null; fi; }
trap cleanup EXIT
docker exec "$container" pg_dump -U tattoo_office -d tattoo_office --format=custom > "$archive.partial"
docker exec -i "$container" pg_restore --list < "$archive.partial" >/dev/null
mv "$archive.partial" "$archive"
docker exec "$container" createdb -U tattoo_office "$scratch"
created=1
docker exec -i "$container" pg_restore -U tattoo_office --exit-on-error --no-owner -d "$scratch" < "$archive"
docker exec "$container" psql -U tattoo_office -d "$scratch" -v ON_ERROR_STOP=1 -Atc "SELECT count(*) FROM users; SELECT count(*) FROM bookings; SELECT count(*) FROM master_media;" >/dev/null
cleanup
created=0
printf 'Tattoo Office backup and isolated restore verified: %s\n' "$stamp"
