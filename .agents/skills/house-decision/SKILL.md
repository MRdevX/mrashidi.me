---
name: house-decision
description: >-
  Reads and writes decision records (DR-NNNN) in docs/decisions. Use when starting
  feature work, when a change is hard to reverse or cross-cutting, or when an accepted
  decision needs superseding.
---

# House decision records

The decision records folder (Project facts → **Decision records**, usually `docs/decisions/`)
holds the **why** behind engineering choices. Issues hold the what and when. `docs/` guides hold
how the system works today.

## Before feature work

1. Skim the index in `docs/decisions/README.md`.
2. `rg -il "<area or keyword>" docs/decisions/` for records touching your change.
3. Treat every `accepted` record as binding. If your change contradicts one, stop and either
   adjust the change or write a superseding record in the same PR.

Done when you can name every accepted record your change touches, or know there are none.

## When to write one

Write a record when the change is any of:

- **Hard to reverse**: data shape, auth model, deploy topology, vendor or library choice.
- **Cross-cutting**: two or more apps, or an app plus infrastructure.
- **Non-obvious**: you rejected the option a competent engineer would try first.
- **Expensive to re-derive**: evidence someone would otherwise gather again.

Not for routine features, bug fixes, copy, or dependency bumps.

## Writing one

1. Next number: `ls docs/decisions | grep -E '^[0-9]{4}' | sort | tail -1`, plus one. Never
   reuse a number.
2. Copy `docs/decisions/_template.md` to the filename pattern from Project facts
   (`NNNN-short-slug.md` by default). The slug names the decision (`release-gated-deploys`),
   not the ticket (`improve-ci`).
3. Fill every heading; write "None" rather than deleting one.
   - **Summary box**: someone who reads only this can act correctly.
   - **Context**: evidence with numbers and where they came from.
   - **Decision**: present tense, specific enough to hold a PR against.
   - **Consequences**: include what got worse.
   - **Alternatives considered**: the obvious option, with a real reason it lost. An empty
     table means this was not a decision.
   - **Revisit when**: concrete triggers.
4. Add the index row to `docs/decisions/README.md` in the same commit.
5. Link the record from the PR body and the issue.

Done when the file, index row, and links land in one commit and `status` is set.

## Changing one

Accepted records are immutable history. Only edit `status`, `superseded_by`, or a factual
error. To change a decision, write a new record with `supersedes: [DR-NNNN]`, then set the old
one to `superseded` with `superseded_by`. Never delete a record; `reverted` records are the
most valuable kind.
