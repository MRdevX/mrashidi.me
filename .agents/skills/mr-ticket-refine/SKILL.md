---
name: mr-ticket-refine
description: >-
  Brings a ticket up to the definition of ready from what the code, decision records, epic and
  siblings already settle, splits one past the size line into ready backlog sub-issues, and
  un-parks loop parks. Works with Linear or GitHub issues. Use when writing, refining, auditing
  or splitting a ticket or epic, or un-parking a blocked ticket.
---

# Ticket refine

Standard: `.agents/ticket-format.md`, plus the project's `docs/agent/ticket-loop.md` (size line,
gate lines) and `docs/agent/ticket-loop.json` (tracker, team, states). The `mr-ticket-refiner`
subagent judges; this session reads and writes the tracker through the Tracker table in
`mr-ticket-loop`, applies the result and writes one marker comment. Retry an MCP write the
classifier denies once. No ticket-loop.json: stop and say the project is not set up for the loop.

| Call | Does |
| ---- | ---- |
| `/mr-ticket-refine <id>` | Refine one ticket, split it if too big, un-park a loop park |
| `/mr-ticket-refine <epic id or Linear project>` | Every open non-epic sub-issue in epic order, plus missing relations |
| `/mr-ticket-refine new <epic or project> "<title>"` | Draft a ticket from the conversation, create it on confirmation |

## 1. Refine

1. Packet: `issue <id>` (relations, latest comment if it is a loop marker), the epic's
   description (cache per epic), sibling ids and titles.
2. Dispatch `mr-ticket-refiner` with the packet and any triage result. It returns
   `{decidable, patch, relations_to_add, split, questions, decisions}`.
3. `split` non-empty: go to section 2.
4. Apply `patch` (`update <id> --patch-file F`, or `save_issue(id, patch)`). A failed anchor:
   re-read and re-dispatch once, then stop. Add `relations_to_add` as `blockedBy`.
5. Decidable: a loop park goes to `todo`; comment `Refined`. Not decidable: `blocked`, remove
   the ready label, clear the assignee; comment `Parked` with the questions.

`decisions` go in your report; the refined description is the record.

## 2. Split

The original keeps the **last** piece, so every relation pointing at it stays true. Each earlier
piece becomes a new issue: the config's team (Linear), same project and parent, `backlog`, title
`<Area> <n><letter>: <piece>`, the ticket template written ready from the refiner's scope. Chain
them: the first new piece copies the original's `blockedBy`, each later piece is blocked by the
one before, the original by the last new one. Patch the original down to its piece, `backlog`
if it was `blocked`, comment `Split`. Workspace mode parks instead.

## 3. Epic audit (`<epic or project>`)

Every arrow `a → b` in the epic's order line gets a `blockedBy` from `b` to `a` when missing.
List relations the epic does not mention; keep them. The epic text stays as written.

## 4. New ticket (`new`)

Fill the template from the conversation and `rg`, show the draft, then create it: the epic as
parent (and the project on Linear), `blockedBy`, `backlog`. The ready label only when asked.

## Limits

- A product question, or a tie no source settles, is a question for a person.
- Edit only tickets before `inReview`, only the sections that change, and only relations you
  add. Epics, decision records and tickets a person blocked stay as they are.
