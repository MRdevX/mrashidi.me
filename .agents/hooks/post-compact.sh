#!/bin/bash
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

branch=$(git branch --show-current 2>/dev/null)
[ -n "$branch" ] || exit 0

ticket=$(grep -oE '([A-Z]+-[0-9]+|gh-[0-9]+)' <<<"$branch" | head -1)
if [ -z "$ticket" ]; then
  ticket=$(grep -oE '[a-z]+-[0-9]+' <<<"$branch" | head -1 | tr '[:lower:]' '[:upper:]')
fi
gate=$(grep -E '^\|[[:space:]]*Gate[[:space:]]*\|' AGENTS.md 2>/dev/null | cut -d'|' -f3 | xargs)

echo "Context restored after compaction:"
echo "- Branch: $branch"
[ -n "$ticket" ] && echo "- Ticket: $ticket"
[ -n "$gate" ] && echo "- Gate: $gate"
base=$(git rev-parse --verify -q origin/main >/dev/null && echo origin/main)
if [ -n "$base" ]; then
  echo "- Commits on this branch:"
  git log --oneline "$base"..HEAD 2>/dev/null | head -15 | sed 's/^/    /'
fi
changes=$(git status --short 2>/dev/null | head -30)
if [ -n "$changes" ]; then
  echo "- Uncommitted changes:"
  sed 's/^/    /' <<<"$changes"
fi
exit 0
