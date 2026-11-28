---
name: mr-plan
description: Plan a ticket (ABC-123) before any code is written - pull the ticket, read the code it touches, interview the user round by round until nothing is assumed, then write docs/plans/<ticket>.md. Use when the user wants to plan, scope, break down, or prepare a ticket for implementation.
argument-hint: ABC-123
---

A plan is done when every acceptance criterion has a proof and every change names the file it copies. Reach that by fetching facts yourself and putting only decisions to the user.

## 1. Facts from the ticket

Run the `mr-ticket` skill's ticket-context step for `ABC-123` into a scratch folder (its `scripts/ticket-context.sh ABC-123 <scratchdir>` for the tracker in the **Tracker** Project fact).

Then the PR title search from `/mr-ticket` step 2. Run its `scripts/shipped.sh` only when the ticket follows up on shipped work.

Done when every acceptance criterion is a numbered line in your notes and every ticket or PR in `ABC-123.urls.txt` has been read.

## 2. Reconnaissance

Dispatch one Explore agent per touched area ("very thorough"), all in one message. Brief each with the ticket file path, the criteria it serves, the area, the instruction to read the repo's `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md` and matching `.claude/rules/` first, and this return format, every claim with a `path:line`, no recommendations:

1. **Lands in**: package and slice or folder, with the reason.
2. **Pattern to copy**: the nearest existing file with the same shape and what to copy from it, or "new ground".
3. **Reuse**: helpers, types, guards and fixtures in the shared libraries, test utilities or the package that already cover part of the change. Re-implementing one of these is the most common mistake.
4. **Callers**: every caller of each function, route, RPC, entity or event the change will modify, and whether any consumer in the **Consumers** fact is involved.
5. **Tests**: existing unit and integration specs on this path and the fixture they use.
6. **Surprises**: anything that contradicts the brief or the docs. Facts only.

Spot-check one `path:line` from each report before relying on it.

Done when each criterion maps to at least one file path and one pattern example, or is marked "new ground".

## 3. Grilling

Run `/mr-grill`. Seed the first frontier with whatever these leave open:

- What each criterion means at the edge (empty, duplicate, concurrent, wrong tenant).
- What happens on every failure path. Silent failure is never an option.
- Data shape: new column or table, migration, backfill, whether a DB value set needs a text column.
- Who owns authorization for the write.
- Feature flag, tenant or customer scope.
- Permanent feature or one-off backfill.
- Which test proves each criterion: unit spec, integration spec, end-to-end or API-collection flow.
- Rollout order across services, and whether a release of a shared package is needed.
- Consumers: does the change touch a contract file the **Consumers** fact lists (proto, gRPC handler, route, version, request/response class, signing keys, shared cache keys)? If so, which consumer code depends on it, and the expand/contract order with the consumer team's ticket (the `mr-work` skill's `references/contracts.md`). Run the project's own impact-check skill on a spike if it has one and you are unsure.

Every question carries a recommendation. Facts are fetched, never asked. Decisions with real trade-offs use the `mr-work` skill's [`references/decisions.md`](../mr-work/references/decisions.md): an options table (pros, cons, risk, effort), the recommendation and the case against it, then AskUserQuestion.

Done when the frontier is empty and the user has said the understanding is shared.

## 4. Write the plan

Write the plan at the path the `mr-work` skill's `scripts/plan-path.sh ABC-123` prints: the main checkout's `docs/plans/ABC-123.md` (gitignored), so every worktree sees the same file.

```markdown
# ABC-123 <ticket summary>

## Status
- Phase: 3 Plan
- Branch: -
- Worktree: -
- Gates green at: -
- Reviewed at: -
- PR: -
- Updated: <date>

## Goal
One paragraph: the visible behaviour after the change.

## Flow
Mermaid diagram of the changed flow when it crosses a service, gRPC or queue boundary or changes a data flow; omit otherwise ([`visuals.md`](../mr-work/references/visuals.md)).

## Acceptance criteria to proof
| # | Criterion (quoted) | Proof (spec file, or command and expected result) |

## Decisions
One bullet per grilling decision: decision, why, alternative rejected.

## Changes
| File | Change | Pattern to copy |
Ordered by dependency. New files carry the slice they belong to.

## Test seams
Unit specs, integration specs, fixtures reused.

## Out of scope
What was deferred and why.

## Risks and open questions
Anything unresolved and who can answer it.

## Consumer impact
Consumer contracts touched, expand/contract steps, consumer-team ticket draft. "None" when nothing is touched.

## Rollout
Migration order, flags, multi-service sequencing, release needed or not.

## Noticed, not done
Out-of-scope problems found while planning: where, what, why it matters, evidence.
```

Done when every criterion row has a proof and every Changes row names a pattern or says "new".

## 5. Gate G1

In one message: `mr-standards` on the plan file, and one `mr-skeptic` per Decision that carries risk (contract, migration, auth, rollout), asked for the strongest case against it. Fold confirmed findings into the plan; put anything that changes a decision back to the user in the `decisions.md` format.

When the work is big (more than one service, a contract change, a migration), offer Chat / Artifact / Doc for the plan overview per [`visuals.md`](../mr-work/references/visuals.md).

## 6. Hand off

Set Status to `Phase: 4 Build`, end with What / Why / How / Evidence / Next (`/mr-work`), print the plan path, and offer `/mr-build <plan path>`, best in a fresh session.
