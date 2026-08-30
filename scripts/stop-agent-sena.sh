#!/usr/bin/env bash
# Non-destructive stop script: stops Docker containers without removing volumes.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

echo "Stopping database container (preserving volumes)..."
docker compose --env-file .env -f infra/compose/docker-compose.yml stop
echo "Database stopped."
