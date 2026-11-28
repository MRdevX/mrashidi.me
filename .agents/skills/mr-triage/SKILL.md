---
name: mr-triage
description: Morning digest for the user - their open tickets in the current sprint or cycle and their status, PRs waiting for their review, CI and review state of their own open PRs, and new or regressed error-tracker issues since yesterday, as one table with a suggested order. Read-only. Use when the user asks what to work on, for a triage, a morning or daily overview, or what needs attention. Turning production errors into tracker issues is /mr-errors.
context: fork
model: sonnet
effort: medium
---

Gather, don't judge: collect the state of the user's work in one pass and return it as tables. Read-only everywhere.

Sources come from the Project facts: **Tracker** (which tracker, project, sprint or cycle, and any "waiting on a production check" label) and **Error tracker** (org and projects). Commands for the tracker are in the `mr-ticket` skill's `references/trackers/<tracker>.md`. `<owner>` is the GitHub org the Tracker fact names, or the current repo's owner.

## Collect (run independent commands together)

1. **My tickets**: open tickets assigned to the user in the current sprint or cycle, by priority, with summary, status, priority, type and last update.
   - Jira: Atlassian MCP `searchJiraIssuesUsingJql`, cloudId from the Tracker fact, jql `assignee = currentUser() AND sprint in openSprints() AND statusCategory != Done ORDER BY priority DESC`, fields `["summary","status","priority","issuetype","updated"]`. Fallback: `acli jira workitem search --jql '<same>' --fields 'key,summary,status,priority'`.
   - Linear: the adapter's "Find work" row, assignee me, state not done.
   - GitHub: `gh issue list --assignee @me --state open`.
2. **Review requests**: `gh search prs --owner <owner> --review-requested=@me --state open --json number,title,repository,author,createdAt,isDraft,url`.
3. **My open PRs**: `gh search prs --owner <owner> --author @me --state open --json number,title,repository,url`, then for each `gh pr checks <n> --repo <repo>` (summarise as passing / failing <job> / pending) and `gh pr view <n> --repo <repo> --json reviewDecision,comments --jq '{reviewDecision, comments: (.comments|length)}'`.
4. **Errors**: per backend project in the Error tracker fact, issues first seen or regressed in the last 24h on production (e.g. `sentry issue list <org>/<project> --period 1d --json`; query recipes in the `mr-investigate` skill's `references/error-tracker.md`). A self-hosted instance behind a VPN: probe its API with a 5-second `curl` first and skip it unless that returns 200.
5. **Waiting on a production check**: tickets assigned to the user carrying the Tracker fact's ready-for-production label, if it names one.

A source that fails or has no fact: one line saying which and why, then carry on.

## Return

One section per source, each a compact table with clickable links in every row (ticket id, PR URL, error short ID, event count, users, first seen). Then **Suggested order**: at most five lines, in this priority: production error new or regressed with users affected, my PR with failing CI or changes requested, review requests older than a day, my tickets by priority, production checks. Each line says why it is in that place.

No personal data, user emails or names from the error tracker; counts and IDs only.
