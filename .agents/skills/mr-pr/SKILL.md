---
name: mr-pr
description: >-
  Writes the pull request title and body in the house format (overview, before/after change
  table, breaking changes, affected endpoints, how to test, plus the project's extra sections),
  commits and pushes the branch, opens the PR as a draft, and answers or addresses review
  comments on the user's own PR. Use when asked to commit, push, create, open, draft, or rewrite
  a PR or its description, or to respond to reviewers.
---

# House PR

A reviewer should understand the change in under a minute. Plain words, short sentences. Lead with
why it exists, put the changes in a table, and say how to check it.

## 1. Gather

```bash
git fetch origin
git log --oneline <base>..HEAD
git diff --stat <base>...HEAD
git diff <base>...HEAD
```

`<base>` is the default branch unless the work is stacked. If the plan's Status says `Reviewed at`
the current HEAD, the review is done; otherwise run `/mr-review <base>` (`self` mode) first and
fold its findings in.

Read the Project facts (`AGENTS.md`, or the untracked `CLAUDE.local.md` / parent `CLAUDE.md` where
the repo can't carry them) for the gate command, issue reference style, extra PR sections, and
endpoint sources. If the repo has `.github/pull_request_template.md`, the body matches its
sections. Read the whole diff before writing. The body describes **behaviour**, not files, because
the file list is already on the diff tab. Done when you can say in one sentence what changed for a
user, caller, or operator.

## 2. Title

The title is the conventional commit for the whole change, in the project's commit convention:
`feat(web): hold to reveal the Spy role`. Lower case after the colon, no trailing period, under 72
characters. An issue reference goes in the title only when the project's convention puts one in
its commit subjects.

## 3. Body

Use exactly these sections, in this order, followed by any **Extra PR sections** from Project
facts. Drop a section marked *optional* when it has nothing to say; never write "None" or "N/A"
there.

```markdown
## Overview

One or two sentences: what was wrong or missing, and what this does about it.

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

- **Overview**: name the visible effect where there is one.
- **What Changed**: one row per behaviour someone could notice, not per file. `Before` is what the
  base branch does now; write `Nothing` for something new. If nothing observable changed
  (refactor, docs, tests), replace the table with one sentence saying so. A design choice a
  reviewer might push back on gets one line saying why, in the table or just under it.
- **Breaking Changes**: anything that forces callers, clients, data, env vars, or deploy steps
  to change. Removed or renamed fields, routes, config keys, and migrations count. A change to a
  contract file named in the **Consumers** fact is checked here.
- **Affected Endpoints**: only when the change touches an HTTP or gRPC surface. Diff the
  **Endpoint sources** from Project facts (and the OpenAPI paths or proto files, if the project
  has them). List added, removed, and changed routes. Methods in upper case.
- **How to Test**: runnable commands with the expected result beside them, or for UI the
  click-path and what should appear; a reviewer follows it without asking you anything. The last
  line is the gate command that ran, not its output.
- Issue references follow **Issue reference** in Project facts, one per line. Without a project
  rule, they go at the end of the Overview section. Claim a closing reference (`Closes`,
  `Fixes`) only when every acceptance criterion is met; otherwise use the project's "relates to"
  form.
- Extra PR sections come last, in the order Project facts lists them, and follow that
  project's rules for them. Nothing follows them: no tool or generation footer.

A full body: [`references/example.md`](references/example.md).

## 4. Style

Tone, noise list and the accuracy self-check: the `mr-work` skill's `references/writing.md`. On top
of that:

- No agent attribution lines, no emoji, no em dashes, no marketing words.
- No narration of how you got there, no self-review, no file-by-file list.
- Skip what the diff already shows: test counts, line counts, file lists.
- Code identifiers in backticks.

## 5. Commit and push

Each on the user's go, with the exact message shown first.

- Message: one conventional line in the project's commit convention, lowercase after the colon,
  at most 72 characters, no body, no trailers, no attribution.
- Commit from the worktree root. A pre-commit hook may run lint and a build; give `git commit` a
  long timeout. A hang after the hook passed is usually commit signing waiting on its agent: report
  it.
- Hooks must pass. When a failure looks unrelated, check it on the default branch and report;
  `--no-verify` is not an option.
- `git push -u origin <branch>`. The default branch is never pushed.

## 6. Open

Draft unless the user says otherwise.

```bash
gh pr create --draft --base <base> --head <branch> --title "<title>" --body-file <scratch>/pr-body.md
```

To update an open PR: `gh pr edit <number> --body-file <scratch>/pr-body.md`. Done when
`gh pr view --json title,body` shows the house format and nothing else. Write the PR URL into the
plan's Status (`Phase: 6 Ship`, `PR: <url>`) when there is a plan.

In a Claude Code cloud session (`CLAUDE_CODE_REMOTE=true`) the GitHub proxy rejects `gh pr` and
`gh issue`, which use GraphQL. Use the session's GitHub tools, or the REST API:

```bash
gh api repos/{owner}/{repo}/pulls -f base=main -f head="$(git branch --show-current)" \
  -f title="<title>" -F body=@<scratch>/pr-body.md -F draft=true
```

## 7. Review comments on the user's own PR

Answering reviewers after the PR is open: [`references/responding.md`](references/responding.md).
