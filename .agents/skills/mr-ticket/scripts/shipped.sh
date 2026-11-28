#!/usr/bin/env bash
# For a ticket key: find its PRs on GitHub and report, per merged PR, the
# EARLIEST published release tag that contains the merge commit.
# Usage: shipped.sh ABC-123 [owner]   (owner defaults to the current repo's GitHub owner)
#
# Monorepo note: a repo may publish several tag families (app@*,
# service-foo@*, ...). Only the family that drives the prod deploy
# counts. We prefer the family named after the repo itself and fall back to
# all tags when there is no such family.
#
# Perf note: tags published before the merge cannot contain it, so we only
# compare against tags published after mergedAt.
set -euo pipefail

KEY="${1:?usage: shipped.sh KEY [owner]}"
OWNER="${2:-$(gh repo view --json owner -q .owner.login)}"

echo "## PRs whose TITLE names $KEY"
echo

gh search prs "$KEY" --owner "$OWNER" --limit 50 \
  --json number,title,repository,state,url \
| jq -r --arg key "$KEY" '.[] | select(.title | contains($key))
    | "\(.repository.nameWithOwner)\t\(.number)\t\(.state)\t\(.title)"' \
| while IFS=$'\t' read -r repo num state title; do
    echo "### $repo#$num [$state]"
    echo "$title"
    if [ "$state" != "merged" ]; then
      echo "  NOT MERGED -> nothing is deployed anywhere for this PR"
      echo
      continue
    fi
    IFS=$'\t' read -r sha base merged < <(gh pr view "$num" --repo "$repo" \
      --json mergeCommit,baseRefName,mergedAt \
      -q '[.mergeCommit.oid, .baseRefName, .mergedAt] | @tsv')
    name="${repo##*/}"
    echo "  merged $merged into $base as ${sha:0:8}"
    echo "  STAGING: on $base since $merged — confirm the push-to-$base run went green"

    tags=$(gh release list --repo "$repo" --limit 100 \
      --json tagName,isDraft,publishedAt \
      | jq -r --arg n "$name" --arg m "$merged" '
          [ .[] | select((.isDraft | not) and .publishedAt > $m) ] as $all
          | ([ $all[] | select(.tagName | startswith($n + "@")) ]) as $fam
          | (if ($fam | length) > 0 then $fam else $all end)
          | sort_by(.publishedAt)
          | .[] | "\(.tagName)\t\(.publishedAt)"')

    found=""
    while IFS=$'\t' read -r tag published; do
      [ -z "$tag" ] && continue
      ahead=$(gh api "repos/$repo/compare/$tag...$sha" --jq '.ahead_by' 2>/dev/null || echo "?")
      if [ "$ahead" = "0" ]; then
        echo "  PROD: first shipped in $tag (published $published)"
        found=1
        break
      fi
    done <<< "$tags"
    [ -z "$found" ] && echo "  PROD: NOT in any published release tag yet"
    echo
  done
