#!/bin/bash
# e2e.sh — suite Playwright del front (tests/e2e) contra el stack local, headless en Docker.
#
# Uso:
#   scripts/e2e.sh [--en stack|CLGDC-N] [argumentos de playwright test…]
#   scripts/e2e.sh --help
#
# --en stack (por defecto): pruebas y config del front principal, contra el dev server del stack.
# --en CLGDC-N: pruebas y config del worktree .worktrees/frontend-CLGDC-N; el sitio es su preview
#   (lgdc-preview-CLGDC-N, de sesion.sh preview) si está corriendo y, si no, el dev server del stack.
# E2E_NODE_MODULES: volumen de node_modules con @playwright/test (por defecto el del front del
#   stack, laguiadechile_frontend_node_modules). Sirve para correr la suite antes de instalar la
#   dependencia en el stack.
# Al terminar, pase o no la suite, borra las cuentas e2e-registro-%@e2e.lgdc.test y sus mensajes
# de Mailpit. Sale con el código de Playwright (o 1 si pasó pero la limpieza falló).

set -u

RAIZ="/Users/carlosromanxyz/Development/laguiadechile"
FRONT="$RAIZ/laguiadechile-frontend"
PW_VERSION="1.64.0"
PW_IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"
VOL_NM="${E2E_NODE_MODULES:-laguiadechile_frontend_node_modules}"
DB="laguiadechile-db"
PATRON_EMAIL="e2e-registro-%@e2e.lgdc.test"
DOMINIO_EMAIL="e2e.lgdc.test"

uso() { sed -n '4,15p' "$0" | sed 's/^# \{0,1\}//'; }
die() { echo "✗ $*" >&2; exit 1; }
arriba() { [ "$(docker inspect -f '{{.State.Running}}' "$1" 2>/dev/null)" = "true" ]; }

EN="stack"
ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    -h|--help|help) uso; exit 0 ;;
    --en) EN="${2:-}"; shift ;;
    --en=*) EN="${1#--en=}" ;;
    *) ARGS+=("$1") ;;
  esac
  shift
done

docker info >/dev/null 2>&1 || die "Docker no responde (¿OrbStack apagado?)"

# Árbol con las pruebas y contenedor cuya red se usa (ahí localhost:3000 es el front).
if [ "$EN" = "stack" ]; then
  ARBOL="$FRONT"; RED="laguiadechile-frontend"
elif [[ "$EN" =~ ^CLGDC-[0-9]+$ ]]; then
  ARBOL="$RAIZ/.worktrees/frontend-$EN"
  [ -d "$ARBOL" ] || die "no existe el worktree $ARBOL"
  if arriba "lgdc-preview-$EN"; then RED="lgdc-preview-$EN"; else RED="laguiadechile-frontend"; fi
else
  die "--en acepta stack o CLGDC-N"
fi
[ -f "$ARBOL/playwright.config.ts" ] || die "no hay playwright.config.ts en $ARBOL"
for c in "$RED" laguiadechile-backend laguiadechile-mailpit "$DB"; do
  arriba "$c" || die "el contenedor $c está apagado (./start.sh up -d)"
done
docker volume inspect "$VOL_NM" >/dev/null 2>&1 || die "no existe el volumen $VOL_NM"
docker image inspect "$PW_IMAGE" >/dev/null 2>&1 || docker pull -q "$PW_IMAGE" >/dev/null \
  || die "no se pudo bajar $PW_IMAGE"

# El volumen se monta en /node_modules: Node lo encuentra subiendo desde /app y el árbol queda en
# solo lectura sin necesitar un punto de montaje dentro.
docker run --rm --name "lgdc-e2e-check-$$" -v "$VOL_NM":/node_modules:ro "$PW_IMAGE" \
  grep -qs "\"version\": \"$PW_VERSION\"" /node_modules/@playwright/test/package.json \
  || die "el volumen $VOL_NM no trae @playwright/test@$PW_VERSION (npm install en el contenedor del front, o E2E_NODE_MODULES=<volumen>)"

# ─────────────────────────── limpieza (siempre) ───────────────────────────
LIMPIO=0
limpiar() {
  [ "$LIMPIO" = 1 ] && return 0
  LIMPIO=1
  local ok=0 n
  if docker exec "$DB" psql -U postgres -d laguiadechile -v ON_ERROR_STOP=1 -qtAc \
      "DELETE FROM \"User\" WHERE email LIKE '$PATRON_EMAIL'" >/dev/null; then
    n=$(docker exec "$DB" psql -U postgres -d laguiadechile -qtAc \
      "SELECT count(*) FROM \"User\" WHERE email LIKE '$PATRON_EMAIL'")
    if [ "$n" = "0" ]; then echo "· limpieza: cuentas $PATRON_EMAIL borradas (quedan 0)"
    else echo "✗ limpieza: quedan $n cuentas $PATRON_EMAIL" >&2; ok=1; fi
  else
    echo "✗ limpieza: no se pudieron borrar las cuentas $PATRON_EMAIL" >&2; ok=1
  fi
  # Mensajes de prueba que hayan quedado en Mailpit (la suite ya borra los suyos en afterAll).
  if docker run --rm --name "lgdc-e2e-mailpit-$$" --network container:laguiadechile-mailpit "$PW_IMAGE" \
      node -e "fetch('http://localhost:8025/api/v1/search?query=' + encodeURIComponent('to:\"$DOMINIO_EMAIL\"'), { method: 'DELETE' }).then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"; then
    echo "· limpieza: mensajes para @$DOMINIO_EMAIL borrados de Mailpit"
  else
    echo "✗ limpieza: no se pudieron borrar los mensajes de Mailpit" >&2; ok=1
  fi
  return "$ok"
}
trap 'limpiar' INT TERM

mkdir -p "$ARBOL/test-results" || die "no se pudo crear $ARBOL/test-results"
echo "· e2e: pruebas de $ARBOL contra localhost:3000 de $RED (node_modules: $VOL_NM)"
docker run --rm --name "lgdc-e2e-$$" --network "container:$RED" --ipc=host --init \
  --mount "type=bind,src=$ARBOL,dst=/app,readonly" \
  --mount "type=volume,src=$VOL_NM,dst=/node_modules,readonly" \
  --mount "type=bind,src=$ARBOL/test-results,dst=/salida" -e E2E_OUTPUT_DIR=/salida/ultima \
  -e E2E_BASE_URL=http://localhost:3000 -e MAILPIT_URL=http://mailpit:8025 \
  -w /app "$PW_IMAGE" node /node_modules/@playwright/test/cli.js test ${ARGS[@]+"${ARGS[@]}"}
rc=$?

limpiar || { [ "$rc" = 0 ] && rc=1; }
exit "$rc"
