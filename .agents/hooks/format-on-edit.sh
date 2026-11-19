#!/bin/bash
set -uo pipefail

file=$(jq -r '.tool_input.file_path // empty')
[ -n "$file" ] && [ -f "$file" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

biome="node_modules/.bin/biome"
if [ -x "$biome" ] && { [ -f biome.json ] || [ -f biome.jsonc ]; }; then
  "$biome" format --write --no-errors-on-unmatched "$file" >/dev/null 2>&1
elif [[ "$file" == *.swift ]] && command -v swift-format >/dev/null; then
  swift-format format --in-place "$file" >/dev/null 2>&1
fi
exit 0
