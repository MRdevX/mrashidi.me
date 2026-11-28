#!/usr/bin/env bash
# List the user's review threads since a date and what happened to each, for calibration.
#   review-outcomes.sh 2026-11-10 [owner]   # markdown table on stdout; owner defaults to the current repo's
# Columns: PR · label (bold prefix of the comment) · resolved · outdated (the line changed later) ·
# PR state · first reply by someone else · thread link. No judgement; calibration classifies.
set -euo pipefail
since=${1:?usage: review-outcomes.sh <YYYY-MM-DD> [owner]}
owner=${2:-$(gh repo view --json owner -q .owner.login)}
me=$(gh api user -q .login)

# ponytail: first 50 PRs and 100 threads per PR, no pagination; enough for one sprint.
gh api graphql -f q="org:$owner is:pr reviewed-by:$me updated:>=$since" -f query='
query($q: String!) {
  search(query: $q, type: ISSUE, first: 50) {
    nodes { ... on PullRequest {
      number state repository { name }
      reviewThreads(first: 100) { nodes {
        isResolved isOutdated
        comments(first: 20) { nodes { author { login } body url } }
      } }
    } }
  }
}' | jq -r --arg me "$me" '
  def clip: gsub("[\r\n]+"; " ") | gsub("\\|"; "\\|") | .[0:120];
  "| PR | Label | Resolved | Outdated | PR state | Reply | Thread |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  (.data.search.nodes[] | . as $pr | .reviewThreads.nodes[]
    | select(.comments.nodes[0].author.login == $me)
    | .comments.nodes as $c
    | ($c[0].body | capture("^\\*\\*(?<l>Blocker|Suggestion|Question)") .l // "none") as $label
    | ([$c[] | select(.author.login != $me)][0].body // "" | clip) as $reply
    | "| \($pr.repository.name)#\($pr.number) | \($label) | \(.isResolved) | \(.isOutdated) | \($pr.state) | \($reply) | [link](\($c[0].url)) |")'
