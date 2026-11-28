---
name: mr-ship
description: >-
  Ships the current work: runs the gate, commits in one-line conventional commits, pushes the
  branch, opens or updates the PR in the house format, and links the ticket. Use when told to
  commit and open a PR, push and open a PR, or ship it.
disable-model-invocation: true
---

# Ship

Read `AGENTS.md` → **Project facts** for the gate and the issue reference style.

## 1. Branch

If the current branch is the default branch, create `claude/<slug>` from it first, where the
slug names the change (`claude/mas-412-reminder-dedupe`, `claude/hold-to-reveal`). Never commit
to the default branch.

## 2. Review

Spawn the `mr-standards` subagent on the diff against `origin/main`. Fix every finding it marks
**HARD**, or say why not. Leave **JUDGEMENT** and **SMELL** findings to the user.

## 3. Gate

Run the gate. On failure, fix and rerun until it passes; never skip hooks or use `--no-verify`.
If the failure is unrelated to this change, stop and report it.

## 4. Commit

One concern per commit, cleanup in its own commit (house rules §6, §7). Each message is one
conventional line with no body and no trailers. Stage files by name, never `git add -A`, and
never stage `.env*`, `.dev.vars` or generated credentials.

## 5. Push and open the PR

```bash
git push -u origin HEAD
```

Then follow `mr-pr` to write the title and body, with the ticket reference in the place the
**Issue reference** fact names. If a PR for the branch is already open (`gh pr view`), update its
body instead of opening another.

## Done when

The PR URL is printed, `gh pr checks` shows the checks running, and the working tree is clean.
Report the URL and the commit list.
