#!/usr/bin/env bash
# Ticket worktrees. Local only: never pushes, never touches tracked files.
#   worktree.sh new <repo> <branch>    .claude/worktrees/<name> from origin/<default>, plus repo setup
#   worktree.sh done <worktree-path>   move its docs/plans to the main checkout, then remove it
#   worktree.sh list <repo>            every worktree: branch, state, plan files
# <repo> is a folder under $WORKTREE_ROOT (default: the parent of the current repo), per the Worktrees
# Project fact. Setup after `new`: the repo's executable .agents/worktree-setup.sh (or
# .claude/worktree-setup.sh, untracked is fine), run inside the new worktree; none means no setup.
set -euo pipefail
M=${WORKTREE_ROOT:-$(dirname "$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null | sed 's|/\.git$||')" 2>/dev/null || pwd)}
die() { echo "worktree.sh: $*" >&2; exit 1; }
default_branch() { git -C "$1" symbolic-ref --short refs/remotes/origin/HEAD | sed 's|^origin/||'; }
main_of() { local c; c=$(git -C "$1" rev-parse --path-format=absolute --git-common-dir); echo "${c%/.git}"; }
# PR state per branch, one API call per repo: "<branch>\t<STATE>" lines
pr_states() { gh pr list --repo "$(git -C "$1" remote get-url origin | sed -E 's|.*github.com[:/]||; s|\.git$||')" \
  --author @me --state all --limit 300 --json headRefName,state -q '.[] | "\(.headRefName)\t\(.state)"' 2>/dev/null || true; }
quiet() { # run a setup command, print its output only when it fails
  local log; log=$(mktemp); "$@" >"$log" 2>&1 || { tail -40 "$log"; rm -f "$log"; die "setup failed: $*"; }; rm -f "$log"; }

case ${1:-} in
new)
  repo=$M/${2:?repo}; branch=${3:?branch}; wt=$repo/.claude/worktrees/${branch##*/}
  [[ -d $repo/.git ]] || die "no repo at $repo"
  def=$(default_branch "$repo")
  git -C "$repo" fetch -q origin "$def"
  git -C "$repo" worktree add -q "$wt" -b "$branch" "origin/$def"
  cd "$wt"
  for setup in "$repo/.agents/worktree-setup.sh" "$repo/.claude/worktree-setup.sh"; do
    [[ -x $setup ]] && { quiet "$setup"; break; }
  done
  echo "$wt" ;;

done)
  wt=$(cd "${2:?worktree path}" && pwd -P); main=$(main_of "$wt"); branch=$(git -C "$wt" branch --show-current)
  [[ $wt != "$main" ]] || die "$wt is the main checkout"
  [[ -z $(git -C "$wt" status --porcelain) ]] || die "uncommitted changes in $wt"
  if [[ $(git -C "$wt" rev-list --count HEAD --not --remotes) != 0 ]]; then
    pr_states "$main" | grep -q "^$branch	MERGED$" || die "$branch has commits that are on no remote and no merged PR"
  fi
  if [[ -d $wt/docs/plans ]]; then
    conflicts=$(cd "$wt/docs/plans" && find . -type f | while read -r f; do
      [[ -e $main/docs/plans/$f ]] && ! cmp -s "$f" "$main/docs/plans/$f" && echo "$f"; done || true)
    [[ -z $conflicts ]] || die "plan files differ from $main/docs/plans, merge by hand:"$'\n'"$conflicts"
    mkdir -p "$main/docs/plans" && { cp -Rn "$wt/docs/plans/." "$main/docs/plans/" || true; } # macOS cp -n exits 1 on skipped (identical) files
  fi
  git -C "$main" worktree remove "$wt"
  echo "removed $wt (branch $branch kept)" ;;

list)
  repo=$(cd "$M/${2:?repo}" && pwd -P); def=$(default_branch "$repo"); prs=$(pr_states "$repo")
  printf '%-52s %-44s %-10s %s\n' WORKTREE BRANCH STATE PLANS
  git -C "$repo" worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r wt; do
    [[ $wt == "$repo" ]] && continue
    # folder already deleted: `git worktree prune` clears the entry
    [[ -d $wt ]] || { printf '%-52s %-44s %-10s %s\n' "${wt##*/}" "-" gone 0; continue; }
    branch=$(git -C "$wt" branch --show-current); pr=$(grep "^$branch	" <<<"$prs" | head -1 | cut -f2 || true)
    if [[ -n $(git -C "$wt" status --porcelain) ]]; then state=dirty
    elif [[ $pr == MERGED ]]; then state=merged
    elif [[ $(git -C "$wt" rev-list --count "origin/$def..HEAD") == 0 ]]; then state=empty
    elif [[ $(git -C "$wt" rev-list --count HEAD --not --remotes) != 0 ]]; then state=unpushed
    else state=${pr:-pushed}; fi
    plans=$( [[ -d $wt/docs/plans ]] && find "$wt/docs/plans" -type f | wc -l | tr -d ' ' || echo 0)
    printf '%-52s %-44s %-10s %s\n' "${wt#"$repo"/.claude/worktrees/}" "${branch:-(detached)}" "$state" "$plans"
  done ;;

*) sed -n '2,9p' "$0"; exit 2 ;;
esac
