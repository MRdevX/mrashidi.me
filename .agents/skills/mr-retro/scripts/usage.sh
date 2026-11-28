#!/usr/bin/env bash
# Skill and subagent run counts from Claude Code transcripts since a date, plus the mr-* skills and
# agents that were never run. Local read only.
# Usage: usage.sh YYYY-MM-DD [project-folder glob, default all]
set -euo pipefail
since=${1:?usage: usage.sh YYYY-MM-DD [glob]}
glob=${2:-*}
cd ~/.claude/projects
tmp=$(mktemp); trap 'rm -f "$tmp"' EXIT
find . -path "./$glob" -name '*.jsonl' -newermt "$since" -print0 | xargs -0 jq -r --arg since "$since" '
  select((.timestamp // "") >= $since) |
  if .type == "assistant" then .message.content[]? | select(.type == "tool_use")
    | if .name == "Skill" then "skill\t\(.input.skill)" elif .name == "Agent" then "agent\t\(.input.subagent_type // "general-purpose")" else empty end
  elif .type == "user" and (.message.content | type) == "string" then
    .message.content | capture("<command-name>/(?<s>[\\w:-]+)</command-name>") | "skill\t\(.s)"
  else empty end' 2>/dev/null > "$tmp" || true
for kind in skill agent; do
  echo "## ${kind}s since $since"
  awk -F'\t' -v k=$kind '$1 == k {print $2}' "$tmp" | sort | uniq -c | sort -rn
  echo
done
echo "## mr-* never run since $since"
for s in ~/.claude/skills/mr-*; do grep -q "^skill	${s##*/}$" "$tmp" || echo "skill ${s##*/}"; done
for a in ~/.claude/agents/mr-*.md; do n=${a##*/}; grep -q "^agent	${n%.md}$" "$tmp" || echo "agent ${n%.md}"; done
