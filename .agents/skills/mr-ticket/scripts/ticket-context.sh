#!/usr/bin/env bash
# Gather everything known about a Jira ticket into readable Markdown.
# Usage: ticket-context.sh ABC-123 [outdir]   (Jira; field ids per the jira tracker adapter)
set -euo pipefail

KEY="${1:?usage: ticket-context.sh KEY [outdir]}"
OUT="${2:-.}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$OUT"
RAW="$OUT/$KEY.json"

acli jira workitem view "$KEY" --fields '*all' --json > "$RAW"

jq -r -L "$DIR" 'include "adf";
  "# \(.key) — \(.fields.summary)\n",
  "| field | value |",
  "| --- | --- |",
  "| Type | \(.fields.issuetype.name) |",
  "| Status | \(.fields.status.name) |",
  "| Assignee | \(.fields.assignee.displayName // "-") |",
  "| Reporter | \(.fields.reporter.displayName // "-") |",
  "| Created | \(.fields.created) |",
  "| Updated | \(.fields.updated) |",
  "| Labels | \((.fields.labels // []) | join(", ")) |",
  "| Components | \(((.fields.components // []) | map(.name)) | join(", ")) |",
  "| Fix versions | \(((.fields.fixVersions // []) | map(.name)) | join(", ")) |",
  "| Sprints | \(((.fields.customfield_10010 // []) | map("\(.name) [\(.state)]")) | join(", ")) |",
  "| Parent | \(.fields.parent.key // "-") |",
  "",
  "## Dev panel (counts only — no URLs)\n",
  "```\n\(.fields.customfield_10000 // "none" | tostring | split(", json=")[0])\n```",
  "",
  "## Description\n",
  (.fields.description | adf2text),
  "",
  "## Linked issues\n",
  (((.fields.issuelinks // []) | map("- \(.type.name): \(.inwardIssue.key // .outwardIssue.key) — \(.inwardIssue.fields.summary // .outwardIssue.fields.summary // "")")) | join("\n")),
  "",
  "## Attachments\n",
  (((.fields.attachment // []) | map("- \(.filename) (\(.mimeType), by \(.author.displayName), \(.created))")) | join("\n")),
  "",
  "## Comments (\(.fields.comment.total // 0))\n",
  ((.fields.comment.comments // []) | map("### \(.author.displayName) — \(.created)\n\n\(.body | adf2text)\n") | join("\n---\n\n"))
' "$RAW" > "$OUT/$KEY.md"

# Every URL mentioned anywhere in the ticket (this is how PRs are actually found).
jq -r '[.fields.description, .fields.comment.comments[]?.body] | ..
  | objects
  | (select(.type=="inlineCard" or .type=="blockCard") | .attrs.url),
    (select(.type=="text") | .marks[]? | select(.type=="link") | .attrs.href)' "$RAW" \
  2>/dev/null | grep -v '^mailto:' | sort -u > "$OUT/$KEY.urls.txt" || true

echo "$OUT/$KEY.md"
