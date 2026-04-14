#!/usr/bin/env bash
# caddy-setup.sh - One-time first-run setup for a fresh server.
#
# Replaces the old systemd Caddy setup - Caddy now runs as a Docker container.
#
# Prerequisites before running this:
#   1. Docker + docker compose (v2 plugin syntax) installed
#   2. .env.production present in the portfolio root
#   3. Tunnel credentials JSON in infra/.cloudflared/TUNNEL_ID.json
#      (create tunnel: cloudflared tunnel create portfolio)
#   4. infra/cloudflared-config.yml updated with your TUNNEL_ID and domain
#
# After this script: use "bash infra/deploy.sh" for all future deploys.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$REPO_ROOT/docker/docker-compose.yml"
CADDYFILE_TMPL="$REPO_ROOT/infra/Caddyfile.tmpl"
CADDYFILE="$REPO_ROOT/infra/Caddyfile"
ACTIVE_PORT_FILE="$REPO_ROOT/infra/.active_port"

# Ensure credentials directory exists (contents are gitignored)
mkdir -p "$REPO_ROOT/infra/.cloudflared"

echo "[setup] Generating initial Caddyfile (blue slot) ..."
sed "s|__BACKEND__|portfolio-blue:3000|" "$CADDYFILE_TMPL" > "$CADDYFILE"
echo "3001" > "$ACTIVE_PORT_FILE"

echo "[setup] Building initial Docker image ..."
docker build -f "$REPO_ROOT/docker/Dockerfile" -t "portfolio:latest" "$REPO_ROOT"

echo "[setup] Starting all services (caddy, cloudflared, portfolio-blue) ..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "[setup] Done. Services running:"
docker compose -f "$COMPOSE_FILE" ps
echo ""
echo "[setup] To deploy updates: bash infra/deploy.sh"
