# Writing for other people

Applies to everything that leaves the machine: tracker comments and tickets, PR bodies, review comments,
consumer-team ticket drafts, access requests. Chat with the user keeps its own What / Why / How / Evidence / Next shape.

## Reader first

Name the reader before writing: PM, teammate, PR author, a consumer's team. Ask what they need in ten
seconds. **The first line answers it**: the verdict, the status or the ask. Everything after it is
support, and a reader who stops after line one still has the point.

## Shape

1. **Outcome line**, bold label first: `**Fixed on staging.**`, `**Blocked:**`, `**Need a decision:**`
2. **The detail**: a table when 3 or more items share the same fields (per environment, per
   criterion, before/after, per repo); otherwise up to 5 bullets, one fact each.
3. **Still open**: what isn't done or checked, in user terms, and when it will be. Skip if nothing.
4. **Links**, inline where they're mentioned.

Comments use bold labels, not headings. Headings belong in ticket bodies and PRs.

## Tone

Casual but professional, like explaining it to a colleague at their desk.

- First person, contractions, active voice. "I tested it on staging", not "It was tested".
- Short sentences, one idea each. Plain words over jargon: "the reminder didn't go out", not
  "the notification job failed to enqueue".
- Say how sure you are, once: "from the logs", "from reading the code", "not checked on prod yet".
- Facts, not effort: "The DSN pointed at a dead host", not "After a thorough investigation I found".

- Direct and respectful: name the problem and the fix plainly, about the code, not the person.
  "This drops the error", not "you forgot to handle the error". One ask per comment.
- Praise only when it's specific ("the retry test covers the exact race"), never as padding.

**Never:** em dashes; filler openers or closers ("Great news!", "Hope this helps", "Let me know if
you have questions"); stacked hedges ("it might possibly"); minimisers and blame ("just", "simply",
"obviously", "why didn't you"); sarcasm; bolding half the text; emoji other than the status set
below.

## Accuracy gate

A wrong statement costs more trust than a missing one. Before showing any draft:

1. **Claim ledger** (chat only, never posted): list every factual sentence with its proof: a
   permalink or `file:line` at the head SHA, a query with its link, a repro step you ran.
2. **No proof, no statement.** Verify it (read the code, `mr-evidence`, `mr-skeptic`), or turn it
   into a question, or drop it. Never post "probably" as a finding.
3. **Re-check after rewording.** Edits drift: "only", "all", "always", "before this PR", numbers,
   names and environments go back to their source once the wording is final.
4. **Say how you know**, once per comment: "Reproduced on staging", "From reading the code, not run".

## Value test

Keep a comment only if the reader would do something differently after reading it. Out:

- restating the diff, the ticket, or what someone already said in the thread (agree in that thread
  instead)
- a second comment for the same issue ("Same in `x.ts`" goes in the first one)
- anything on the never-post list in `mr-review`, or that you'd struggle to defend if asked "so what?"

## Leave out (noise)

These stay in chat or the evidence folder:

- commit SHAs, release tags, UUIDs, raw log lines, UTC timestamps, status codes
- file paths and function names, unless the reader is a developer and that's where the fix goes
- test counts, line counts, file lists (the diff shows them)
- tool and agent names (Claude, mr-skeptic, a tracker CLI), library internals
- anything already in the ticket description

Long evidence a reader may still want goes in a collapsed `[!expand]` section, not the main text.

## Status and links

One status set everywhere: ✅ works · ❌ broken · ⏳ waiting on release · ❓ not checked.

Links are short text with the URL behind them: [ABC-123](https://…), [repo#8618](https://…),
[error issue](https://…). Never a bare long URL.

## Jira formatting

When the **Tracker** fact is Jira: write Markdown, convert with the `mr-ticket` skill's
`scripts/md2adf.py draft.md > body.json`, post it as the `mr-ticket` skill's Jira adapter says. The `.md` is
what the user approves at G3. Linear and GitHub issues take Markdown as is; the GitHub rules below apply. Plain text
renders tables as literal pipes, so never post Markdown unconverted. A single newline stays a line
break; a blank line starts a new paragraph.

| Element | Syntax | Use for |
| --- | --- | --- |
| Table | pipe table | 3+ items with the same fields |
| Info panel | `> [!info]` | context the reader needs first |
| Success panel | `> [!success]` | acceptance criteria, what's done |
| Warning panel | `> [!warning]` | risk, still open, needs a decision |
| Error panel | `> [!error]` | blocker, out of scope |
| Custom panel | `> [!panel #DEEBFF]` | the user story in a new ticket |
| Expand | `> [!expand] Title` | long detail people may skip |
| Smart link | `<https://github.com/o/r/pull/1>` alone on a line | a PR or ticket; Jira shows its title and status |
| Mention | `@[Display Name](accountId)` | the person who must act; notifies them |

Mention only the person who has to act, in the line that asks them (`**Need a decision:** @[Ana B](id) ...`),
at most two per comment. A bare `@name` is plain text in Jira and notifies nobody; get the accountId
with the Atlassian MCP `lookupJiraAccountId`.

At most one or two panels per comment. Panels can't hold tables (the script refuses); put the table
outside or in an expand.

## GitHub formatting

PR bodies, review bodies and review comments are GitHub Markdown, posted as is. Preview anything
non-trivial with `gh api markdown -f mode=gfm -f text="$(cat draft.md)"`.

| Element | Syntax | Use for |
| --- | --- | --- |
| Suggested change | a fenced block with language `suggestion` | a one-hunk fix the author commits in one click; replaces exactly the commented lines |
| Permalink | `https://github.com/<o>/<r>/blob/<sha>/<path>#L10-L14` alone on a line | evidence outside the hunk; renders as a code snippet |
| Alert | `> [!IMPORTANT]`, `> [!WARNING]`, `> [!NOTE]` | review or PR body only, at most one |
| Collapsed | `<details><summary>How I checked</summary>` … `</details>` | repro, query, long evidence |
| Table | pipe table | before/after, 3+ alike items |
| Code | backticks; fenced with a language | identifiers, commands |

Jira callouts are lowercase (`[!info]`, converted by md2adf); GitHub alerts are uppercase
(`[!NOTE]`). They don't mix: each renders as a literal line on the other side.

## Lint

`python3 scripts/draft-lint.py draft.md` from this skill's folder (Jira), `--github draft.md`
(PR body), or `review.json` (GitHub review). It flags em dashes, banned phrases, SHAs, UUIDs, UTC
timestamps, bare URLs, the wrong callout dialect, and in reviews a missing label, an over-long
comment or a second question. Fix what it flags; it doesn't replace the accuracy gate.

## Length

| Message | Budget |
| --- | --- |
| Jira status or investigation comment | about 10 lines |
| Verification report | about 15 lines plus screenshots |
| Review comment | 2 short paragraphs |
| PR body | readable in a minute |

## Templates

**Progress update**

```markdown
**<Where it stands, one sentence.>** <What that means for the user.>

- <done thing, linked PR>
- <done thing>

**Next:** <next step and roughly when>.
```

**Investigation result**

```markdown
**Found it:** <cause in user terms>. <What the user saw and since when.>

| | |
| --- | --- |
| Affected | <who or what, how many> |
| Since | <date or release, in words> |
| Fix | <what changes, linked PR or "not started"> |

> [!expand] How I know
> - <evidence one, [Sentry issue](https://…)>
> - <evidence two, [logs](https://…)>

**Still open:** <what is not proven yet>.
```

Not found: `**Not found yet.**` then a table of what's ruled out (`Idea | Checked | Result`).

**Blocker or ask**

```markdown
> [!warning]
> **Need a decision:** <the question, answerable with yes/no or A/B>.

- **A:** <option, its cost>
- **B:** <option, its cost>

I'd go with <A> because <one reason>. Blocked until then: <what>.
```

**Security status**

```markdown
**Security status <date>:** <n> alerts open, down from <n>. <n> fix PRs waiting for review.

| Repo | Dependabot | Code scanning | Secret scanning | Fix PRs |
| --- | --- | --- | --- | --- |
| api | 3 (1 high, 2 medium) | 0 | 0 | [#9201](https://…) ✅ green |

**Closed bot PRs:** [#9100](https://…) superseded by [#9201](https://…).
**No fix available yet:** <package> ([advisory](https://…)).
**Needs a look:** <rule or package> ([alert](https://…)): <one line why>.
```

**Consumer ticket draft** (for a consumer's team)

```markdown
> [!info]
> <provider> is changing <RPC/route> in [ABC-123](https://…). The old one keeps working until you switch.

**What you need to do:** <regenerate stubs, switch call X to Y>.

| | Old | New |
| --- | --- | --- |
| RPC | `<old>` | `<new>` |

**When:** the new one is live on production since <date>. The old one goes away after this ticket ships.
```

**Access request**

```markdown
**Request:** <role> on <project/cluster> for <hours>.
**Why:** <ticket>, need to <one action> because <reason the read-only access can't answer>.
**What I'll touch:** <read-only / exact command>.
```

## Example

Before:

> Hi! After a deep dive into the logs I found that the issue seems to possibly be related to the
> `NotificationProcessor` failing on job 8f3a2c1e at 2026-11-20T09:14:03Z — see commit a1b2c3d.
> PR is up, 14 tests added. Let me know if you have any questions!

After:

> **Found it:** reminders weren't sent when a session moved after the first reminder went out.
> It's been happening since the 12 Nov release. The fix is in [api#9210](https://…), on staging
> tomorrow.

## Before showing a draft (G3)

1. Does line one give the outcome or the ask?
2. Anything from the noise list?
3. Three or more alike items not in a table?
4. `draft-lint.py` clean?
5. Every factual sentence in the claim ledger with its proof, re-checked after the last rewording?
6. Does every comment pass the value test, and does its label match its severity?
7. Rendered right? (`adf2text` round-trip for Jira, `gh api markdown` for GitHub)
8. Would a PM understand it without asking you anything?
