---
name: house-pr
description: >-
  Writes the pull request title and body in the house format: overview, before/after
  change table, breaking changes, affected endpoints, how to test, plus the project's
  extra sections. Use when opening, drafting, or rewriting a PR description.
---

# House PR

A reviewer should understand the change in under a minute. Plain words, short sentences.

## 1. Gather

```bash
git fetch origin
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
git diff origin/main...HEAD
```

Read `AGENTS.md` → **Project facts** for the gate command, issue reference style, extra PR
sections, and endpoint sources. If the repo has `.github/pull_request_template.md`, the body
matches its sections. Done when you can say in one sentence what changed for a user, caller, or operator.

## 2. Title

The title is the conventional commit for the whole change: `feat(web): hold to reveal the Spy
role`. Lower case after the colon, no trailing period, no issue reference.

## 3. Body

Use exactly these sections, in this order, followed by any **Extra PR sections** from Project
facts. Drop a section marked *optional* when it has nothing to say; never write "None" or "N/A"
there.

```markdown
## Overview

One or two sentences: what this PR does and why.

## What Changed

| Area | Before | After |
| ---- | ------ | ----- |
| Spy role reveal | Three taps: show, hold the word, hide | One hold button shows role and word |

## Breaking Changes            (optional)

- What breaks, who is affected, and the one step to migrate.

## Affected Endpoints          (optional)

| Method | Path | Change |
| ------ | ---- | ------ |
| PATCH | `/api/me/settings` | Accepts `theme` |

## How to Test

1. Starting state.
2. Action.
3. Expected result.

`pnpm ci:affected`
```

Section rules:

- **What Changed**: one row per behaviour someone could notice, not per file. `Before` is what
  `main` does now; write `Nothing` for something new. If nothing observable changed (refactor,
  docs, tests), replace the table with one sentence saying so.
- **Breaking Changes**: anything that forces callers, clients, data, env vars, or deploy steps
  to change. Removed or renamed fields, routes, config keys, and migrations count.
- **Affected Endpoints**: diff the endpoint sources from Project facts (and the OpenAPI paths,
  if the project has them). List added, removed, and changed routes. Methods in upper case.
- **How to Test**: numbered steps a reviewer can follow; the last line is the gate command that
  ran, not its output.
- Issue references follow **Issue reference** in Project facts, one per line. Without a project
  rule, they go at the end of the Overview section.
- Extra PR sections come last, in the order Project facts lists them, and follow that
  project's rules for them.

## 4. Style

- No agent attribution lines, no emoji, no em dashes, no marketing words.
- No narration of how you got there, no self-review, no file-by-file list.
- Code identifiers in backticks. Keep the whole body under about 40 lines.

## 5. Open

```bash
gh pr create --base main --title "<title>" --body-file <scratch>/pr-body.md
```

To update an open PR: `gh pr edit <number> --body-file <scratch>/pr-body.md`. Done when
`gh pr view --json title,body` shows the house format and nothing else.
