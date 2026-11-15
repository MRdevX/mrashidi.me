#!/bin/bash
set -uo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# The image puts its own Node 22 first; the environment's setup script installs the
# project's Node and pnpm into /usr/local.
export PATH="/usr/local/bin:$PATH"
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="/usr/local/bin:$PATH"' >>"$CLAUDE_ENV_FILE"
fi

status=()
failures=()

seeded=()
while read -r example; do
  target="${example%.example}"
  [ -e "$target" ] && continue
  cp "$example" "$target" && seeded+=("${target#./}")
done < <(find . -name node_modules -prune -o -name .git -prune -o -type f \
  \( -name '.env*.example' -o -name '.dev.vars*.example' \) -print)
[ ${#seeded[@]} -gt 0 ] && status+=("env: ${seeded[*]} (from examples)")

while read -r lock; do
  dir=$(dirname "$lock")
  if pnpm --dir "$dir" install --frozen-lockfile --prefer-offline >/dev/null 2>&1; then
    status+=("deps: ${dir#./}")
  else
    failures+=("pnpm install in ${dir#./} (fix: pnpm --dir ${dir#./} install)")
  fi
done < <(find . -name node_modules -prune -o -name pnpm-lock.yaml -type f -print)

if [ -f package.json ] && node -e 'process.exit(require("./package.json").scripts?.["cloud:session"] ? 0 : 1)'; then
  if pnpm run --silent cloud:session >/dev/null 2>&1; then
    status+=("cloud:session")
  else
    failures+=("pnpm cloud:session (fix: run it and read the error)")
  fi
fi

summary="node $(node --version 2>/dev/null) · pnpm $(pnpm --version 2>/dev/null)"
for item in "${status[@]}"; do summary+=" · $item"; done
echo "cloud session ready: $summary"
for failure in "${failures[@]}"; do echo "FAIL $failure"; done
exit 0
