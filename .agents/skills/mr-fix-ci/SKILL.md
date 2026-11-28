---
name: mr-fix-ci
description: >-
  Finds why CI failed on a PR or branch - the failing job or step, the error, and the file:line to
  fix - and, when asked, reproduces it locally, fixes it, pushes, and watches the rerun. Diagnosis
  changes nothing. Use when CI or a check is red, a PR build broke, told to fix the build, or in a
  /loop that watches a PR.
argument-hint: "<pr-number> [repo] [fix]"
context: fork
---

# Fix CI

Diagnose first (steps 1 and 2 change nothing). Go on to step 3 only when the user asked to fix the
build; otherwise return the diagnosis and stop. Repo defaults to the current checkout's `origin`.

## 1. Find the failure

```bash
gh pr checks <n> --repo <repo> --json name,state,link,workflow   # or the current branch's PR
gh run list --branch <branch> --limit 5
gh run view <run-id> --repo <repo> --log-failed | tail -200
```

None failing: return "green" or "pending: <names>" and stop.

In cloud sessions `gh pr` is blocked: use `gh api repos/<owner>/<repo>/commits/<sha>/check-runs`
and `gh api repos/<owner>/<repo>/actions/jobs/<job-id>/logs`.

For each failing check, cut the log down to the first real error: the failing test name, the
assertion or stack, the lint rule, the type error, or the step that exited non-zero. Skip setup
noise and retries of the same failure. A later error caused by an earlier one is not the cause.

## 2. Map it to the code

The spec file and test name, and the source `path:line` the stack or error points at, checked
against the PR's diff (`gh pr diff <n> --repo <repo> --name-only`). Say whether the failing code is
touched by the PR, or looks like a flake or a base-branch problem (same job red on the default
branch: `gh run list --repo <repo> --branch <default> --workflow <workflow> --limit 3`).

Diagnosis, per failing check:

```
Check: <name> (<run link>)
Fails at: <test name | step>
Error: <3-10 lines, verbatim>
Points to: <path:line>, touched by this PR: yes/no
Likely: caused by this PR | flake (passed on retry / red on the default branch too) | infra
```

No secrets from logs; drop any line with a token, key or `Authorization`. Not asked to fix: return
this and stop.

## 3. Reproduce locally

Run the same command the failing step ran, from the workflow file under `.github/workflows/`.
In a Node 24 repo, prefix with `fnm exec --using=.nvmrc --`. If it passes locally, compare
versions, env vars, and caches between CI and local before changing code.

## 4. Fix

Fix the cause, not the symptom: no skipped tests, no `--no-verify`, no lowered thresholds, no
retries around a flaky assertion unless the flake is proven and an issue is filed. If the
failure is on the default branch too, say so and stop.

## 5. Push and confirm

Run the project gate, commit in one conventional line (`fix(ci): …` or the area that broke),
push, then `gh run watch` the new run until it finishes.

## Done when

Diagnosis only: the block above per failing check. Fixing: the checks are green; report the cause
in one sentence, the fix, and the run URL. If they are still red after two attempts, stop and
report what you found.
