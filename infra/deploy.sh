#!/usr/bin/env bash
# deploy.sh - Zero-downtime blue/green deployment for the portfolio.
#
# Requires:
#   - Docker + docker compose (v2 plugin syntax)
#   - Caddy running as a systemd service, admin API on localhost:2019
#   - git repo initialised (used for image tagging)
#   - infra/Caddyfile.tmpl with __BACKEND__ placeholder
#   - .env.production in the portfolio root
#
# Usage: bash infra/deploy.sh [--dry-run]
#
# --dry-run prints every action but does not execute it.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ACTIVE_PORT_FILE="$REPO_ROOT/infra/.active_port"
CADDYFILE_TMPL="$REPO_ROOT/infra/Caddyfile.tmpl"
CADDYFILE="$REPO_ROOT/infra/Caddyfile"
COMPOSE_FILE="$REPO_ROOT/docker/docker-compose.yml"

HEALTH_MAX_RETRIES=15
HEALTH_RETRY_INTERVAL=3   # seconds
DRAIN_SECONDS=5

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

# ── Helpers ───────────────────────────────────────────────────────────────────
log() { echo "[deploy] $*"; }

# run CMD [ARGS...] - execute or print in dry-run mode.
# Uses "$@" (array form, no eval) - safe with paths containing spaces.
run() {
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[dry-run]" "$@"
  else
    "$@"
  fi
}

# ── Determine slots ───────────────────────────────────────────────────────────
if [[ -f "$ACTIVE_PORT_FILE" ]]; then
  CURRENT_PORT=$(cat "$ACTIVE_PORT_FILE")
else
  CURRENT_PORT=3001   # default: blue is active on first deploy
fi

if [[ "$CURRENT_PORT" == "3001" ]]; then
  CURRENT_SLOT="blue"
  NEW_SLOT="green"
  NEW_PORT=3002
else
  CURRENT_SLOT="green"
  NEW_SLOT="blue"
  NEW_PORT=3001
fi

log "Active slot : $CURRENT_SLOT (port $CURRENT_PORT)"
log "Target slot : $NEW_SLOT (port $NEW_PORT)"

# ── Build image ───────────────────────────────────────────────────────────────
GIT_HASH=$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo "nogit")
TIMESTAMP=$(date +%s)
DEPLOY_TAG="${GIT_HASH}-${TIMESTAMP}"
IMAGE="portfolio:${DEPLOY_TAG}"

log "Building image $IMAGE ..."
run docker build -f "$REPO_ROOT/docker/Dockerfile" -t "$IMAGE" "$REPO_ROOT"

# ── Start new slot ────────────────────────────────────────────────────────────
log "Starting portfolio-$NEW_SLOT ..."
run env DEPLOY_TAG="$DEPLOY_TAG" docker compose -f "$COMPOSE_FILE" up -d "portfolio-$NEW_SLOT"

# ── Health check ──────────────────────────────────────────────────────────────
if [[ "$DRY_RUN" == "false" ]]; then
  log "Polling http://localhost:$NEW_PORT/api/health ..."
  HEALTHY=false
  for i in $(seq 1 "$HEALTH_MAX_RETRIES"); do
    if curl -sf "http://localhost:$NEW_PORT/api/health" >/dev/null 2>&1; then
      HEALTHY=true
      log "Health check passed on attempt $i."
      break
    fi
    log "Attempt $i/$HEALTH_MAX_RETRIES - not ready, retrying in ${HEALTH_RETRY_INTERVAL}s ..."
    sleep "$HEALTH_RETRY_INTERVAL"
  done

  if [[ "$HEALTHY" == "false" ]]; then
    log "ERROR: Health check failed after $HEALTH_MAX_RETRIES attempts."
    log "Stopping portfolio-$NEW_SLOT. Old slot stays live."
    docker compose -f "$COMPOSE_FILE" stop "portfolio-$NEW_SLOT"
    exit 1
  fi
fi

# ── Generate Caddyfile and reload ─────────────────────────────────────────────
# sed and the output redirect need to be done directly - shell redirection
# cannot be expressed as a "$@"-style command array.
log "Generating $CADDYFILE (backend: portfolio-$NEW_SLOT:3000) ..."
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[dry-run] sed __BACKEND__=portfolio-$NEW_SLOT:3000 '$CADDYFILE_TMPL' > '$CADDYFILE'"
else
  sed "s|__BACKEND__|portfolio-$NEW_SLOT:3000|" "$CADDYFILE_TMPL" > "$CADDYFILE"
fi

log "Reloading Caddy ..."
run docker exec portfolio-caddy caddy reload --config /etc/caddy/Caddyfile --force

# ── Save active state ─────────────────────────────────────────────────────────
log "Saving active port ..."
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[dry-run] echo $NEW_PORT > '$ACTIVE_PORT_FILE'"
else
  echo "$NEW_PORT" > "$ACTIVE_PORT_FILE"
fi
log "Active port updated to $NEW_PORT."

# ── Drain and stop old slot ───────────────────────────────────────────────────
log "Draining in-flight requests (${DRAIN_SECONDS}s) ..."
run sleep "$DRAIN_SECONDS"

log "Stopping portfolio-$CURRENT_SLOT ..."
run docker compose -f "$COMPOSE_FILE" stop "portfolio-$CURRENT_SLOT"

log "Deploy complete. Active: $NEW_SLOT (port $NEW_PORT), image: $IMAGE"
