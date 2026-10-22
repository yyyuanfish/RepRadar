#!/bin/zsh
set -e
cd "${0:A:h}"
# Standard install first; use Codex's bundled Node if Terminal cannot find Node.
if ! command -v node >/dev/null 2>&1; then
 export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
fi
mkdir -p .runtime
if ! curl -fsS --max-time 2 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
 nohup sh scripts/start-model.sh > .runtime/model.log 2>&1 &
fi
if curl -fsS --max-time 2 http://localhost:3001/api/status >/dev/null 2>&1; then
 open http://localhost:3001
 echo 'RepRadar is already running. The assistant connection can be checked in Team handoff.'
 exit 0
fi
if [ ! -d node_modules ]; then npm ci; fi
npm run build
(sleep 3; open http://localhost:3001) &
npm run start -- -p 3001
