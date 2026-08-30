#!/usr/bin/env bash
# ==============================================================================
# Rakazo Launcher & Desktop Shortcut Script
# ==============================================================================
# Usage on another machine:
#   1. Copy or clone the repository to the machine and complete initial setup (.env, pnpm install).
#   2. Create a desktop shortcut:
#        macOS:
#          ln -s "/path/to/rakazo/scripts/start-rakazo.command" ~/Desktop/Rakazo.command
#          chmod +x ~/Desktop/Rakazo.command
#        Linux:
#          Create a .desktop file or symlink to ~/Desktop/rakazo.sh
#   3. Double-click the shortcut on your desktop!
# ==============================================================================

set -euo pipefail

# Resolve repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${ROOT_DIR}"

echo "=================================================="
echo " Starting Rakazo"
echo " Directory: ${ROOT_DIR}"
echo "=================================================="

# 1. Check and Start Docker
echo "[1/4] Checking Docker daemon..."
if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Starting Docker..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -d "/Applications/Docker.app" ]; then
      open -a Docker
    elif [ -d "/Applications/OrbStack.app" ]; then
      open -a OrbStack
    else
      echo "ERROR: Docker app not found in /Applications. Please install or start Docker." >&2
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux"* ]]; then
    sudo systemctl start docker || sudo service docker start || true
  fi

  echo -n "Waiting for Docker daemon to initialize"
  MAX_RETRIES=60
  COUNT=0
  until docker info >/dev/null 2>&1; do
    COUNT=$((COUNT + 1))
    if [ "${COUNT}" -ge "${MAX_RETRIES}" ]; then
      echo ""
      echo "ERROR: Timed out waiting for Docker daemon to start." >&2
      exit 1
    fi
    echo -n "."
    sleep 2
  done
  echo " Ready!"
else
  echo "Docker daemon is already active."
fi

# 2. Check environment file
if [ ! -f .env ]; then
  echo "ERROR: .env file not found in ${ROOT_DIR}. Please run initial setup first." >&2
  exit 1
fi

# 3. Ensure Postgres container is running
echo "[2/4] Starting Postgres database container..."
docker compose --env-file .env -f infra/compose/docker-compose.yml up postgres -d

# 4. Start Rakazo services
echo "[3/4] Starting Rakazo application stack (API, Web, Worker, Supervisor)..."
pnpm dev &
DEV_PID=$!

cleanup() {
  echo ""
  echo "Stopping Rakazo services (PID ${DEV_PID})..."
  kill -TERM "${DEV_PID}" 2>/dev/null || true
  wait "${DEV_PID}" 2>/dev/null || true
  echo "Rakazo stopped. (Note: Postgres container was kept intact; stop with: docker compose -f infra/compose/docker-compose.yml stop)"
  exit 0
}

trap cleanup INT TERM EXIT

# 5. Wait for Web UI to be ready
echo "[4/4] Waiting for Web UI to respond on http://127.0.0.1:5173..."
READY=0
for i in {1..30}; do
  if curl -sI http://127.0.0.1:5173/ >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done

if [ "${READY}" -eq 1 ]; then
  echo ""
  echo "=================================================="
  echo " Rakazo is LIVE!"
  echo " Web UI: http://127.0.0.1:5173"
  echo " API:    http://127.0.0.1:3100"
  echo "=================================================="
  echo ""
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://127.0.0.1:5173"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://127.0.0.1:5173"
  fi
else
  echo "Server started. Open http://127.0.0.1:5173 in your browser."
fi

echo "Press Ctrl+C to stop Rakazo."
wait "${DEV_PID}"
