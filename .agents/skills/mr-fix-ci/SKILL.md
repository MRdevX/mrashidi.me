---
name: mr-fix-ci
description: >-
  Finds why CI failed on a PR or branch, reproduces it locally, fixes it, pushes, and watches the
  rerun. Use when CI or a check is red, a PR is failing, or told to fix the build.
context: fork
---

# Fix CI

## 1. Find the failure

```bash
gh pr checks <pr>                       # or the current branch's PR
gh run list --branch <branch> --limit 5
gh run view <run-id> --log-failed | tail -200
```

In cloud sessions `gh pr` is blocked: use `gh api repos/<owner>/<repo>/commits/<sha>/check-runs`
and `gh api repos/<owner>/<repo>/actions/jobs/<job-id>/logs`.

Name the failing job, step, and first real error. A later error caused by an earlier one is not
the cause.

## 2. Reproduce locally

Run the same command the failing step ran, from the workflow file under `.github/workflows/`.
In a Node 24 repo, prefix with `fnm exec --using=.nvmrc --`. If it passes locally, compare
versions, env vars, and caches between CI and local before changing code.

## 3. Fix

Fix the cause, not the symptom: no skipped tests, no `--no-verify`, no lowered thresholds, no
retries around a flaky assertion unless the flake is proven and an issue is filed. If the
failure is on `main` too, say so and stop.

## 4. Push and confirm

Run the project gate, commit in one conventional line (`fix(ci): …` or the area that broke),
push, then `gh run watch` the new run until it finishes.

## Done when

The checks are green. Report the cause in one sentence, the fix, and the run URL. If they are
still red after two attempts, stop and report what you found.
