# Ticket format

What a ticket looks like when an agent can finish it unattended. The `mr-ticket-loop` skill
judges every ticket against this page before spending a model on it, and `mr-ticket-refine`
rewrites tickets to it. People writing tickets by hand follow the same page.

Vendored from `github.com/MRdevX/house-rules`; never edit the copy. What differs per project
lives in `docs/agent/ticket-loop.md` (surfaces, gate line per surface, skill per surface, size
line, devices) and `docs/agent/ticket-loop.json` (tracker, states, commands). Ids below are
`<id>`: `MAS-12` on Linear, `#12` on GitHub.

## Template

```markdown
Blocked by <id> (what the blocker provides). If it is not merged, park.

## Why

The user-visible problem or the gap this closes, in two to five lines. Name the decision
record or the sibling implementation that motivates it.

## Scope

Which apps and slices change, the files or modules by name, what stays untouched, and what to
mirror ("endpoints exactly as iOS `ReplanModel` uses them; read it, do not invent").

## Acceptance

- One bullet per guarantee, each judgeable by a command or a deterministic check.
- The gate line for the surface, last (the project's ticket-loop.md).

## References

Decision records, `docs/agent/*` pages, sibling tickets, API paths, designs, the skill to load.
```

The first line exists only when a blocker exists. It mirrors a tracker `blockedBy` relation:
the relation is what the loop reads, the line is for people. One line per blocker.

Sub-issues of an epic are titled `<Area> <n><letter>: <what ships>` (`Android 6c: Replan
sheet`, `Templates 4: public template list`) so the board sorts in build order.

## Definition of ready

A ticket is ready when every line holds. Triage checks these; a miss sends the ticket to
refinement, not to an implementer.

1. Every blocker is merged: in the run's epic branch or on `main` (a `(<id>)` merge subject,
   or a PR whose body says `Fixes <id>`), shipped, or dropped. `In Review` alone proves
   nothing; `agent-loop.mjs rank` checks git.
2. The `Blocked by` line and the tracker's `blockedBy` relations name the same issues.
3. `Why` states the problem a user or operator can see, not the task.
4. `Scope` names the surface(s), the files or slices, and what stays untouched.
5. Every `Acceptance` bullet is judgeable by a command, a test name, or a deterministic check.
   None reads "feels", "looks right", "TBD", or ends in a question mark.
6. The gate line matches the surface (the project's ticket-loop.md) and says **locally**.
7. The work fits one implementer session: the size line in the project's ticket-loop.md for
   the mode (epic or workspace). A few files over still fits; clearly more is split into
   sub-issues, not parked. Never split work that only ships together (a type, its route and its
   one client) just to get under the number.
8. No decision record is needed, or the ticket names the accepted record it implements.
   Writing a record is a human call; a ticket that needs one is not ready.
9. No secret, dashboard, third-party console, or data backfill the ticket does not specify.
10. `References` names the thing to mirror when one exists (the other platform's model, the
    shared type, the API path), so the implementer copies rather than invents.

## Epics

An epic is a parent issue, never claimable. Its first line is **Deliberately not
`agent-ready`.** and its body carries `## Why`, `## What ships`, `## Done when`, `## Order`,
`## References`.

The order section is a sentence the loop can read: `1 and 2 first, then 3 → 4 → 5, then 9, 10,
11 → 12`. An arrow is a dependency, a comma is "any order". Every arrow must also exist as a
`blockedBy` relation on the later sub-issue; `mr-ticket-refine` adds the missing relation and
never removes one a person made.

## Labels and states

- The ready label (`agent-ready` unless ticket-loop.json says otherwise) gates the
  **workspace** run only (`/mr-ticket-loop` with no scope). Naming an epic or project
  authorises every non-epic sub-issue in it, labelled or not.
- The state names come from ticket-loop.json (`backlog`, `todo`, `inProgress`, `inReview`,
  `blocked`, then `shipped` and `dropped` lists). On GitHub, `backlog`, `in-progress`,
  `in-review` and `blocked` are labels, an open issue with none of them is `todo`, and closing
  is `shipped` (completed) or `dropped` (not planned).
- States the loop writes, and nothing else:

| From | To | When |
| ---- | -- | ---- |
| `backlog` or `todo` | `inProgress` | claim, assigned to the loop's user |
| `inProgress` | `inReview` | merged into the epic branch, or its workspace PR opened |
| any claimable | `blocked` | parked, ready label removed, assignee cleared |
| `blocked` (loop park) | `todo` | refined and un-parked |
| `blocked` (loop park) | `backlog` | split; the ticket now holds the last piece |
| `inProgress` (stale loop claim) | `todo` | released: no branch, no worktree, idle |

`shipped` states are never the loop's: merges and deploys move them, or a person does.

## Loop comment markers

The loop writes only what a person needs to continue the ticket, five lines at most. The first
words are fixed, so a later pass can tell a loop park from a person's block. The reasoning
behind a refinement lives in the description itself; the tracker keeps its history.

| Marker | The whole comment |
| ------ | ----------------- |
| `Merged by the ticket loop` | `Merged by the ticket loop into <epic branch> (<sha>). Gate: <gate line>.` plus `Follow-ups: <id>, <id>` when debt was filed as tickets |
| `Shipped by the ticket loop` | Workspace mode: `Shipped by the ticket loop: <PR> (merged \| open, merge exit <n>). Gate: <gate line>.` plus `Follow-ups:` as above |
| `Epic PR opened by the ticket loop` | On the epic: `Epic PR opened by the ticket loop: <PR>. Merged: <id>, <id>. Parked: <id>.` |
| `Parked by the ticket loop` | `Parked by the ticket loop: <one-line reason>.`, then numbered one-line questions, then `Reply and set Todo to continue.` |
| `Refined by the ticket loop` | `Refined by the ticket loop: description updated.` plus `Un-parked to Todo.` when it was parked |
| `Split by the ticket loop` | `Split by the ticket loop into <id>, <id>. This ticket now covers <last piece>.` |
| `Released by the ticket loop` | `Released by the ticket loop: stale claim, no branch or worktree. Back to Todo.` |

Debt the implementer finds is filed as its own backlog ticket (Why, Scope, References; title
searched first to avoid duplicates), never listed in a comment.
