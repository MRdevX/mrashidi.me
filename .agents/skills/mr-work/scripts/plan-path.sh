#!/usr/bin/env bash
# Where a ticket's plan lives: always the MAIN checkout's docs/plans/ (gitignored), so every
# worktree of the repo reads and writes the same file and removing a worktree loses nothing.
# Usage: plan-path.sh ABC-123 [dir inside the repo, default .]
set -euo pipefail
key=${1:?usage: plan-path.sh KEY [repo-dir]}
common=$(git -C "${2:-.}" rev-parse --path-format=absolute --git-common-dir)
main=${common%/.git}
mkdir -p "$main/docs/plans"
echo "$main/docs/plans/$key.md"
