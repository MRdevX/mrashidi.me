#!/bin/bash
set -uo pipefail

command=$(jq -r '.tool_input.command // empty')
[ -n "$command" ] || exit 0

block() {
  echo "Blocked by house-rules guard: $1. Ask the user to run it themselves if it is intended." >&2
  exit 2
}

shopt -s nocasematch
segments=$(printf '%s\n' "$command" | awk '{ gsub(/&&|\|\||;/, "\n"); print }')

while IFS= read -r segment; do
  read -r -a words <<<"$segment"
  [ ${#words[@]} -gt 0 ] || continue

  if [[ "$segment" =~ (^|[[:space:]])git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+push([[:space:]]|$) ]]; then
    [[ "$segment" =~ [[:space:]](-f|--force|--force-with-lease)([[:space:]=]|$) ]] && block "force push"
    [[ "$segment" =~ [[:space:]]\+[^[:space:]]+ ]] && block "force push (+refspec)"
    [[ "$segment" =~ [[:space:]:](main|master)([[:space:]]|$) ]] && block "push to the default branch"
  fi

  [[ "$segment" =~ (^|[[:space:]])wrangler[[:space:]]+deploy([[:space:]]|$) ]] && block "wrangler deploy (deploys go through CI)"
  [[ "$segment" =~ (^|[[:space:]])wrangler[[:space:]]+d1[[:space:]].*--remote ]] && block "wrangler d1 against the remote database"
  [[ "$segment" =~ (^|[[:space:]])terraform[[:space:]]+(apply|destroy)([[:space:]]|$) ]] && block "terraform apply/destroy"

  if [[ "$segment" =~ (^|[[:space:]])rm[[:space:]]+-[a-z]*r[a-z]*f|(^|[[:space:]])rm[[:space:]]+-[a-z]*f[a-z]*r ]]; then
    for word in "${words[@]:1}"; do
      [[ "$word" == -* || "$word" == rm ]] && continue
      case "$word" in
        /tmp/*|/private/tmp/*|/private/var/folders/*|/var/folders/*) continue ;;
        /|/*|'~'|'~/'*|'$HOME'*|'${HOME}'*|..|../*) ;;
        *) continue ;;
      esac
      resolved="${word/#\~/$HOME}"
      [[ -n "${CLAUDE_PROJECT_DIR:-}" && "$resolved" == "$CLAUDE_PROJECT_DIR"/* ]] && continue
      block "rm -rf outside the project ($word)"
    done
  fi

  if [[ "$segment" =~ (drop|truncate)[[:space:]]+(table|database|schema) ]]; then
    url="${DATABASE_URL:-}"
    [[ "$segment" =~ postgres(ql)?://[^[:space:]\'\"]+ ]] && url="${BASH_REMATCH[0]}"
    [[ -z "$url" || "$url" =~ @(localhost|127\.0\.0\.1|postgres|db)[:/] ]] || block "DROP/TRUNCATE against a non-local database"
  fi
done <<<"$segments"
exit 0
