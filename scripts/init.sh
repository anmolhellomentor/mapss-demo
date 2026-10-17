#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install Node.js 20.19+ or 22.12+ and try again." >&2
  exit 1
fi

if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit((major === 20 && minor >= 19) || (major >= 22 && (major > 22 || minor >= 12)) ? 0 : 1)'; then
  echo "Unsupported Node.js version $(node --version). Use Node.js 20.19+ or 22.12+." >&2
  exit 1
fi

if [[ ! -x backend/node_modules/.bin/next || ! -x frontend/node_modules/.bin/vite ]]; then
  npm run setup
fi

exec npm run dev
