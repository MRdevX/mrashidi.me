---
name: mr-ticket-loop
description: >-
  Drains an epic, a Linear project, or the agent-ready queue unattended: implements tickets in
  dependency order, merges each into one local epic branch, splits the ones too big, refines what
  the code can settle, and opens one PR to main at the end; without a scope, one PR per ticket.
  Works with Linear or GitHub issues. Use when told to work the queue, drain an epic or project,
  or keep shipping tickets.
model: opus
effort: medium
---

# Ticket loop

You orchestrate: tracker, rank, worktrees, dispatch, merge, report. Subagents write the code and
judge, returning JSON only: `mr-ticket-triage` (Haiku), `mr-ticket-refiner` (Opus),
`mr-ticket-implementer` (Sonnet, or Opus when triage says so).

Read first, in the repo root: `.agents/ticket-format.md` (the ticket standard, states, comment
markers), `docs/agent/ticket-loop.md` (this project's surfaces, gate lines, skills, size line,
devices) and `docs/agent/ticket-loop.json` (tracker, team, ready label, state names, `doctor`,
`bootstrap`, `cleanup`, `mainWorkflow`). No ticket-loop.json: stop and say the project is not
set up for the loop (`mr-onboard-project` covers it). Below, `$LOOP` is `.agents/loop` and
`<id>` is `MAS-12` on Linear, `#12` on GitHub; state names are the config's.

`/mr-ticket-loop [<epic id> | <Linear project>] [--auto-merge] [--max N]`

- **Epic mode** (an epic id, or a Linear project): every non-epic sub-issue whose blockers are
  merged, in `backlog`, `todo` or loop-parked `blocked`. Tickets merge locally into the **epic
  branch**: the epic's tracker branch (Linear `branch`, GitHub `feature/<n>-<slug>`), or
  `project/<project-name-slug>` for a Linear project. GitHub is touched once, at Finish.
- **Workspace mode** (no scope): ready label + `todo` + unassigned, one PR per ticket, stopping
  at the PR unless `--auto-merge`. Fixes only mechanical gaps, never splits.

Bounds for you and every subagent: never push to `main`, force-push, use `--no-verify`, or
edit decision records or vendored house files. One implementer at a time. Tickets a person
blocked or claimed stay theirs.

## Tracker

`node $LOOP/<tracker>.mjs whoami` (`linear.mjs` or `github.mjs`, per `tracker`) picks the path.
Exit 0: every call goes through the script (JSON out). Exit 3: the tracker's MCP (Linear MCP, or
the GitHub tools). Anything else: stop. Multi-line text goes in a scratchpad file passed by path.

| Need | Script | Linear MCP |
| ---- | ------ | ---------- |
| Rank input, epic mode | `graph <scope> --order <id>,…` | `list_issues` + `get_issue(includeRelations)` per open issue |
| Rank input, workspace | `queue` | `list_issues(label, state: todo, assignee: null)` |
| One ticket or epic | `issue <id>` | `get_issue` + `list_comments` |
| State, assignee, labels, blockers | `update <id> --state S --assignee me\|none --add-label L --remove-label L --blocked-by <id>` | `save_issue` |
| Description | `update <id> --patch-file F` or `--description-file F` | `save_issue(patch)` |
| Comment | `comment <id> --body-file F` | `save_comment` |
| New ticket | `create --title T --description-file F [--project P] [--parent <id>] [--blocked-by <id>]… [--label L]…` | `save_issue` |

`github.mjs` uses `gh api` REST only, so it also works in cloud sessions where `gh issue` is
blocked.

## 0. Preconditions

```bash
MAIN=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
git -C "$MAIN" fetch origin main && git -C "$MAIN" worktree prune
node $LOOP/agent-loop.mjs worktree sweep
```

Then the config's `doctor` and `cleanup` commands when set. Epic mode: `node
$LOOP/agent-loop.mjs epic open <epic-branch>` (exit 1 on divergence: stop). Workspace mode:
`gh auth status` and `node $LOOP/agent-merge.mjs main-health` (exit 7: stop). Note which host
tools the project's surfaces need (ticket-loop.md) and which exist.

## The pass (repeat until a stop)

1. **Load.** The epic's order line once (`issue <epic>`), then the rank input. Epic mode adds
   `"epicBranch": "<branch>"` to it. MCP path: build `{mode, me, order, epicBranch, issues:
   [{id, title, status, labels, priority, assignee, hasChildren, blockedBy, branch, startedAt,
   lastCommentByLoop}]}`; `lastCommentByLoop` is whether a `blocked` issue's latest comment
   starts with `Parked by the ticket loop`.
2. **Rank.** Pipe it to `node $LOOP/agent-loop.mjs rank`: `claimable`, `waiting`, `stale`,
   `merged`. Hand back each `merged` (step 9). Exit 2: nothing claimable, go to Finish.
3. **Release** each `stale` claim: `todo`, assignee none, `Released` comment. Re-rank.
4. **Triage** the first claimable with its description, labels, mode, parked flag and host
   tools. `host_can_run` false: skip it this run and report the missing tool.
5. **Refine or split** when `ready` is false, `too_big`, or a loop park: run `mr-ticket-refine`
   (`too_big` goes to its split). `refined`: triage again. `split`: back to 1. `parked`: next
   claimable.
6. **Claim.** `inProgress`, assignee me, then `node $LOOP/agent-loop.mjs worktree add <id>
   <branch> --base <epic-branch>` (workspace mode: no `--base`). Non-zero: park with the output
   and stop the run.
7. **Implement.** Dispatch the implementer (`model: <tier>`, `mode: ticket`, or `pr` in
   workspace mode) with worktree, branch, base, id, title, description, surfaces and their gate
   lines and skills from ticket-loop.md. It returns `{outcome, commit, pr, questions, split,
   debt, gate, attempts}`. `too_big`: hand `split` to the refine skill, `worktree remove <id>`,
   back to 1.
8. **Land.**
   - Epic mode: `node $LOOP/agent-loop.mjs epic merge <id> "<commit>" --into <epic-branch>`.
     Exit 3 (epic moved): one round with the implementer, "rebase onto <epic-branch>", then
     merge again.
   - Workspace mode with `--auto-merge`: `node $LOOP/agent-merge.mjs merge <pr>`. Exit 4: one
     fix round, merge again; still red, park with the PR. Exit 5 or 6: leave it open.
9. **Hand back.**
   - Landed: `inReview`; each `debt` item is a backlog ticket (search the title first); one
     `Merged` (epic mode) or `Shipped` comment.
   - Parked: `blocked`, remove the ready label, clear the assignee, one `Parked` comment.
   - Always: `worktree remove <id>` and a ledger line `<id> | outcome | sha or PR | model |
     attempts`. Back to 1.

## Finish (epic mode)

When rank exits 2 and `epic status <epic-branch>` shows `unpushed` > 0, dispatch the
implementer with `mode: finish`, the epic worktree, the branch, and the merged and parked ticket
ids. It merges `origin/main`, runs the full gate and one review on the combined diff, pushes, and
opens the PR or updates the open one. It returns `{outcome, pr, gate, questions}`. One `Epic PR`
comment on the epic. Red after its fix round: report the branch and the failure, push nothing.

Pushed: `node $LOOP/agent-loop.mjs epic close <epic-branch>` (a re-run reopens it from
`origin`), then the config's `cleanup`, and shut down any simulator or emulator you booted.

## Stop when

Nothing is claimable (after Finish); `--max N` tickets dispatched; a precondition broke
mid-run; workspace mode only: `main-health` exits 7, three shipped in review mode, or two parks
in a row.

## Report

The ledger, the epic PR or branch, `waiting` with reasons, skipped tickets with the missing
tool, parked tickets with their questions, and tickets created (splits and debt).
