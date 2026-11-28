---
name: mr-ticket
description: Context and deploy state of a tracker ticket (Jira, Linear or GitHub issue) - pull its description and comments, find the PRs behind it, prove what is actually deployed in each environment - then post a comment back, or file a new ticket with a correctly formatted body. Use when the user asks what a ticket says, what is live for it, to comment on or follow up on a ticket, or to create, file, draft or raise a bug or ticket. Working a ticket end to end is /mr-work, debugging is /mr-investigate, verifying a deploy is /mr-verify, reviewing code is /mr-review.
---

Every ticket task shares the same front half: what was asked, what was written, what is live. Do steps 1 to 3 in order, then branch. Skipping step 3 is the expensive mistake, because investigating or testing an environment that does not have the change wastes the whole run.

**Pick the tracker adapter** from the **Tracker** Project fact: [`references/trackers/jira.md`](references/trackers/jira.md), [`linear.md`](references/trackers/linear.md) or [`github.md`](references/trackers/github.md). It holds every read, comment, create and search command below. `<mr-ticket>` in commands is this skill's folder (`.agents/skills/mr-ticket` when vendored, `~/.claude/skills/mr-ticket` on a global install). Ticket ids look like `ABC-123` (Jira, Linear) or `#123` (GitHub).

**Filing a new ticket skips steps 1 to 3** and goes straight to [`references/creating.md`](references/creating.md). On Jira write the body as ADF, never plain text, and read it back before saying it is done.

## 1. What was asked

Read the ticket with the adapter: description, every comment, and every link in it. On Jira that is

```bash
<mr-ticket>/scripts/ticket-context.sh ABC-123 <scratchdir>
```

which writes `ABC-123.md` (description and every comment as readable text) and `ABC-123.urls.txt` (every link in the ticket).

Read all of it. The **acceptance criteria are the spec**, and each one is a check you owe an answer for. The comment thread usually carries the real root cause and commands a colleague already ran, so reuse theirs rather than inventing your own. Pull any related ticket the thread names.

## 2. What was written

Find the PRs behind the ticket with the adapter's "Finding the PRs" recipe: the links a human added in step 1, plus a search for the ones nobody linked. The owner for `gh search` is the current repo's (`gh repo view --json owner -q .owner.login`) unless the Tracker fact names another.

Read the diff. It names the observable behaviour to work with: the status code, the event name, the message key. Use that, not your guess at what the ticket meant.

## 3. What is live

```bash
<mr-ticket>/scripts/shipped.sh ABC-123 [owner]
```

Per merged PR whose title names the id, prints the merge commit and the earliest published release tag containing it. Then confirm the deploy actually ran, per the **Environments** fact, and beware that a green tag is not a green deploy: [`references/deploys.md`](references/deploys.md).

State plainly, per environment, whether the change is present. When it is not, stop and say so rather than reporting a failure that is really an absent deploy.

## 4. Branch

**Verify a fix.** Hand off to `/mr-verify`.

**Investigate a bug.** Hand off to `/mr-investigate`; it reuses steps 1 to 3 and runs the evidence loop over the error tracker, logs, and code.

**Review a change.** Hand off to `/mr-review`; the ticket's acceptance criteria are its Spec axis.

**Plan a change.** Hand off to `/mr-plan`; it reuses steps 1 to 3 and ends in `docs/plans/ABC-123.md`.

**File a new ticket.** [`references/creating.md`](references/creating.md): story panel, acceptance criteria in a success panel, locale copy tables, verified after it lands. Reformatting touches only tickets the user reported.

The error tracker answers most "did it actually happen" questions: the `mr-investigate` skill's `references/error-tracker.md`.

## 5. Report

Post to the ticket with the adapter, then transition it only when the user asks. On Jira, convert first:

```bash
python3 <mr-ticket>/scripts/md2adf.py result.md > result.json
acli jira workitem comment create --key ABC-123 --body-file result.json
```

Write `result.md` from a template in the `mr-work` skill's `references/writing.md` (progress update, investigation result, blocker or ask) and run its self-check (accuracy gate, `draft-lint.py`). Lead with what the user or operator sees, say which environment each result came from, and list what you could not verify. Never post Markdown unconverted to Jira: it renders as literal pipes. A verification report follows the `mr-verify` skill's `references/report.md`: short, plain, screenshots inline, no log files.

## Finding work

The adapter's "Finding work" recipe, scoped by the Tracker fact (project, board, the label that marks tickets verified on staging and waiting on a production check).
