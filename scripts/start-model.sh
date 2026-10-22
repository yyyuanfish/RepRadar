#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ -x .runtime/ollama/ollama ]; then
  export OLLAMA_MODELS="$PWD/.runtime/models"
  REPRADAR_OLLAMA="$PWD/.runtime/ollama/ollama"
else
  REPRADAR_OLLAMA="$(command -v ollama || true)"
fi
if [ -z "$REPRADAR_OLLAMA" ]; then
  echo 'Install Ollama from https://ollama.com/download, then run this command again.'
  exit 1
fi
export OLLAMA_HOST=127.0.0.1:11434
export OLLAMA_NUM_PARALLEL=1
export OLLAMA_MAX_LOADED_MODELS=1
exec "$REPRADAR_OLLAMA" serve
