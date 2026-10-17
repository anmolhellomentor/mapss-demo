#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

npm --prefix backend run dev &
backend_pid=$!
npm --prefix frontend run dev -- --host 0.0.0.0 &
frontend_pid=$!

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM
  kill "$backend_pid" "$frontend_pid" 2>/dev/null || true
  wait "$backend_pid" 2>/dev/null || true
  wait "$frontend_pid" 2>/dev/null || true
  exit "$exit_code"
}

trap cleanup EXIT INT TERM

echo "Address map demo starting:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"

wait -n "$backend_pid" "$frontend_pid"
