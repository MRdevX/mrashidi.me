---
name: mr-errors
description: >-
  Triages production errors: pulls unresolved Sentry issues and Cloudflare Workers errors for the
  project, groups them by root cause, dedupes against open tracker issues, and files or updates
  issues for the new ones. Use when triaging production errors, asked what is broken in prod, or on a scheduled triage run.
---

# Triage production errors

The deliverable is tracker issues and a short report. Do not change code here; fixes go
through a ticket.

## 1. Collect

- **Sentry:** `search_issues` for the project's Sentry projects (match the repo or app names),
  unresolved, last 7 days, sorted by events. Take the top 20. For each, `get_issue_details` for
  the stack trace, first and last seen, release, and user count.
- **Cloudflare Workers:** for each Worker the repo deploys (names from `wrangler.json*`), query
  Workers observability for exceptions and 5xx in the same window.

If a source is not connected, say so in the report and continue with the others.

## 2. Group

Group by root cause, not by message: the same frame in our code, the same failing binding, or
the same upstream. Drop noise you can name (bots, extensions, cancelled requests) and list it
separately. Rank groups by users affected, then events.

## 3. Dedupe

Search the tracker from Project facts (Linear team or GitHub issues) for each group: the Sentry
issue id or short id, the error type, and the top in-app frame. An open match gets a comment with
the new counts. A closed match that is recurring gets reopened with a comment.

## 4. File

For each new group worth fixing, create one issue in the format of `.agents/ticket-format.md`:
title naming the user-visible failure, the evidence (Sentry link, counts, first seen, release,
top frames), the suspected cause with the file, and acceptance criteria. Link the Sentry issue to
the tracker issue when the integration supports it. Do not mark issues agent-ready; refinement
does that.

## 5. Report

A table: group, users, events, trend, tracker issue (new, updated, or reopened). Then the noise
list. Done when every group in the top 20 has a row.
