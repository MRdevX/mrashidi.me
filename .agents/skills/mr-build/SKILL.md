---
name: mr-build
description: Implement a planned ticket from docs/plans/<ticket>.md in a loop - test first at the plan's seams, then the project's gate and the consumer-impact check, fixing until everything is green - and stop before committing. Use when the user says build, implement, or code a planned ticket, or after /mr-plan hands off.
argument-hint: docs/plans/ABC-123.md
---

Done means: every acceptance criterion in the plan has its proof passing, every gate below is green on the final diff, the consumer-impact check is OK or its follow-ups are handled, and the diff contains nothing the plan did not ask for. Then stop and hand back; committing, pushing, and the PR are the user's call.

## Build

Work in the ticket's worktree, not the main checkout. The plan's Status names it; if it names none, create it with the command in the **Worktrees** Project fact (default: the `mr-work` skill's `scripts/worktree.sh new <repo> <type/ABC-123-kebab>`, which branches from `origin/<default>` and runs the repo's setup). Write branch and worktree into Status.

Work through the plan's Changes table in dependency order. For each change, write the failing test the plan names first (`/mr-tdd` at that seam), then the smallest code that passes it, copying the "Pattern to copy" file rather than inventing a shape. The repo's `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, and path-scoped `.claude/rules/` apply as files are touched.

## Gates

Run the narrow gate after each change and the full set before stopping. Fix failures at the cause and re-run; a gate is never skipped or loosened to get green. Keep passing output out of the chat: send a gate's output to a scratch file and print only the tail when it fails.

| When | Run |
| --- | --- |
| After each change | the narrowest test command for the touched package or file (one spec, one test file), as the repo's `AGENTS.md`/`CLAUDE.md` describes |
| Before stopping | the **Gate** Project fact in full: lint, type-check and unit tests for every touched package, plus integration tests when entities, migrations, repositories, queues or RPC handlers changed. Infrastructure changes get a plan (`terraform plan` or equivalent) read in full, never an apply, and never against an environment the **Environments** fact marks read-only |

A check the type-checker or bundler does not run on its own (some builds skip type-checking; only a pre-push hook would catch it) belongs in the before-stopping set. A UI-visible criterion also needs the app run locally and a screenshot as its proof.

Before stopping, also:
- The consumer-impact check: when the diff touches a contract file the **Consumers** fact lists, run the project's own impact-check skill if it has one, else the `mr-work` skill's `references/contracts.md` by hand. A BLOCK means the change gets reworked into expand/contract, not shipped as is.
- API collection: a changed route has its request in the project's API collection updated in the same diff, if the project keeps one.
- A changed request/response class: note that consumers with copied types need them regenerated.

## Independent check

With the gates green, in one message: `mr-standards` and `mr-spec` on `git diff <default>...HEAD` (brief them with the ticket file and plan path), plus the project's own auditor agents the diff calls for (logging, security for auth, guards, validation or queries, edge cases when tests changed), launched without a `model` so they run on the model their files pin. Send each finding to `mr-skeptic`. Triage before verifying, as `/mr-review` step 4 describes (one `mr-skeptic` call per file). Fix what is confirmed and in scope, re-run the gates, and carry the rest into the hand-back. This check is the `self` review: write `Reviewed at: <HEAD sha>` into the plan's Status so `/mr-review` and `/mr-pr` do not repeat it for the same commit. You wrote this code, so do not grade it yourself.

## Stay in scope

Improvements noticed along the way (a smell next door, a missing test elsewhere, a suspicious config) go into the plan file under `## Noticed, not done` with one line each: where, what, why it matters, and the evidence (path:line, log query). They do not go into this diff. `/mr-pr` offers them as follow-up tickets.

## Hand back

Update the plan's Status (`Phase: 5 Review`, `Gates green at: <HEAD sha>`), then end with What / Why / How / Evidence / Next (`/mr-work`): criteria and their passing proofs, gates run and their results, the consumer-impact verdict and any follow-ups, the independent-check findings and what was done with each, the noticed-not-done list, and a suggested commit message in the project's convention (with the **Issue reference** fact). Then suggest `/mr-pr`; `/mr-review <default>` is only needed again if the diff changed after this check.
