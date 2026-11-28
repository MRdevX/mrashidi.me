---
name: mr-review
description: >-
  Reviews the changes since a fixed point (commit, branch, tag, or merge-base) along Standards
  (house rules, accepted decision records, the repo's documented standards), Spec (what the
  ticket or plan asked for), and Contracts (does it break a consumer from the Consumers fact).
  Reports the axes side by side, builds a review doc with diagrams for a teammate's PR, and posts
  the review with its verdict once the user confirms. Use when reviewing a PR, a branch, work in
  progress before merging, a teammate's PR, or when asked to "review since X".
---

Review of the diff between `HEAD` and a fixed point the user supplies, in up to five passes:

- **Correctness** (the built-in `code-review` skill, where the repo has no auditor agents): does the change add a bug?
- **Standards** (`mr-standards`): does the code conform to the house rules, the accepted decision records and this repo's documented standards?
- **Spec** (`mr-spec`): does the code faithfully implement the originating issue / spec?
- **Contracts** (when the **Consumers** Project fact lists consumers): does the change break one of them? Run the project's own impact-check skill if it has one, by you (not a sub-agent); otherwise diff the contract files the fact names and read each consumer's call sites.
- **Auditors** (when the repo ships its own auditor agents, e.g. logging, security, edge cases): their findings, judged by `mr-skeptic`.

The passes run in parallel, so they don't pollute each other's context, then this skill verifies and aggregates their findings.

## Modes

- **`self`** (your own branch or commit; the default when no PR number is given, and what `/mr-work`, `/mr-build`, `/mr-pr` and `/mr-ship` use): steps 1 to 5. No review doc, nothing posted. Fix the confirmed findings that are in scope, re-run the gate, and write `Reviewed at: <HEAD sha>` into the plan's Status. A review already recorded for the current HEAD is not run again: say so and stop.
- **`pr`** (a teammate's PR number or URL): all steps, including the doc, the draft and posting.
- **`calibrate <since>`**: no review. Score how past comments landed: [`references/calibration.md`](references/calibration.md).

Never push, merge, or approve without the user's go.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

**Teammate PR** (`#1234` or a PR URL): `gh pr view <n> --json headRefName,baseRefName,author,title,body`, then `git fetch origin <head> <base>` and `git worktree add <scratchpad>/pr-<n> origin/<head>`, and review inside that worktree with `origin/<base>` as the fixed point. Never switch the user's checkout. Read the PR body and existing review comments first so you do not repeat them. If the user already reviewed this PR and it has new commits since, this is a re-review: go to step 8. Remove the worktree when done (`git worktree remove`). For a PR that is already merged, `origin/<base>` contains the change, so the fixed point is `git merge-base origin/<base> <head>`; pass that same SHA to the Contracts pass.

**`dry-run`** in the arguments (used by [`references/eval.md`](references/eval.md)): run steps 1 to 5 and step 7 up to `review.json` and its lint, then stop. No review doc, nothing posted. A dry-run reviews the reference file's `commit_id`, not the PR head, never goes to step 8, and does not read the PR's existing review comments or the reference file's body and comments before `review.json` is written: they are the answer. It reviews the one PR only, with no paired-PR checkout, and reads the PR title but not its body: a merged PR's body describes the fixes made after the review.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here, not inside two parallel sub-agents.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. A ticket key (per the **Tracker** and **Issue reference** Project facts) in the branch name, commit subjects or PR body: fetch it with the `mr-ticket` skill's `scripts/ticket-context.sh <key> <scratchdir>` and treat the acceptance criteria as the spec. A linked GitHub issue counts too.
2. A path the user passed as an argument.
3. The ticket's plan, at the path the `mr-work` skill's `scripts/plan-path.sh <key>` prints, when it exists: it carries the agreed decisions and the criterion-to-proof table, so review against both.
4. If nothing is found, or the key is a placeholder for "no ticket", there is no spec: skip the Spec pass and say so in the report. Ask the user only when a real ticket key exists but its criteria can't be fetched.

### 3. Standards, Spec, auditors: in parallel

Dispatch in one message. Every agent gets the diff command, the commit list, and the repo path; none sees this chat. An auditor that cannot run git (Read, Grep and Glob only) gets the diff saved to a scratch file instead.

- **Correctness** (repos without auditor agents; where auditors exist, replays showed its findings all duplicated theirs): while the agents work, invoke the built-in `code-review` skill at `high` with the same range as its target and follow it. It runs in your turn and reports through its own findings card; its findings then join step 4 like any other pass's.
- **`mr-standards`**: it collects the house rules, accepted decision records, `AGENTS.md`, `CLAUDE.md`, `CLAUDE.local.md`, matching `.claude/rules/`, [`reviewer-lessons.md`](reviewer-lessons.md), any review checklist and the smell baseline itself. Ask it to apply the house checks below to every changed file.
- **`mr-spec`**: add the ticket file path and the plan path from step 2. Skip it when there is no spec and say so in the report.
- **Auditors** (repos that ship them): a logging auditor when the diff touches logging; a security auditor for auth, guards, validation, queries, queues or event handlers; an edge-case auditor when tests changed. Launch them with no `model`, so they run on what their files pin. They find; `mr-skeptic` judges.

The **Contracts** pass runs by you while they work.

House checks (from the house rules; `mr-standards` applies them alongside the repo's own standards):

| Check | Fails when |
| ----- | ---------- |
| Decisions | It contradicts an accepted record without superseding it |
| Slices and layers | Domain imports framework code; a slice reaches into another's internals; validation outside the boundary |
| Simplicity | Speculative options or abstractions; one-caller indirection; duplicated knowledge |
| Comments | Any added comment fails the bar in `mr-comments` |
| Dead code | Unused exports, files, deps, or commented-out code added or left in touched files |
| Framework use | An API that is deprecated or off-convention for the pinned version |
| Tests | New behaviour has no test, or tests assert implementation details |
| Hygiene | Cleanup mixed into a behaviour commit; a commit message that is not a single conventional line, has a body or trailers, or carries agent attribution |
| PR body | Not the `mr-pr` format or the project's PR template; endpoints, breaking changes, or the project's issue references missing |

**Paired PRs** (backend + UI on one ticket): review them together, and test the contract between them for real, not by reading types. Run the consumer's own HTTP client (for example `node -e` with its axios `getUri`) against the producer's parser: axios 1.x sends an array as `queue[]=x`, Express 5's default parser keeps the literal `queue[]` key, and a `whitelist: true` validation pipe drops it silently. Note when tests on both sides miss it (supertest sends `queue=x`, the UI spec mocks the call). Check the other PR out with `git worktree add` in the scratchpad, never by switching the user's checkout, and remove the worktree and branch afterwards.

### 4. Triage, then verify

Verification is the expensive step (in a measured replay, 24 of 28 agent runs, half of them on nits), so cut first:

1. Merge duplicates across passes into one finding.
2. Set aside what will never be acted on: in `pr` mode everything on step 7's never-post list, in `self` mode anything out of the diff's scope. Nits and `SMELL` findings are listed in the chat report as "not verified" and go no further. A `JUDGEMENT` finding about behaviour is a normal finding and gets verified (a rule that set those aside once cut a comment that was really posted).
3. Group what is left by file and send one `mr-skeptic` call per file, with all of that file's findings, their cited lines and the fixed point; at most 10 calls per message. It returns one verdict per claim. A finding that spans files goes with the file where the fix belongs.

The skeptic checks callers across the repo and the consumers, the base branch, existing tests, route prefixes and library source. REFUTED findings are dropped. UNPROVEN ones are either checked by you or kept as questions, never as statements. A risk older than the PR is reported as pre-existing, not as a finding on it.

### 5. Aggregate

Present the reports under `## Standards` and `## Spec` headings, plus `## Contracts` when that pass ran and `## Auditors` when that pass ran, verbatim or lightly cleaned. A Contracts BLOCK goes first in the whole review, above the other axes: it means the change cannot merge as written. Do **not** merge or rerank findings in this chat report: the passes are deliberately separate (see _Why separate passes_). Choosing what to post across them happens in step 7.

End with a one-line summary: total findings per axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

This full report, with every verified finding, is for the user in chat. The author only sees the trimmed review from step 7.

### 6. Review doc (`pr` mode only)

In `self` mode the review ends after step 5: fix, re-run the gate, record `Reviewed at`. In `pr` mode, always and without asking: build a document (a Claude Doc when the docs connector is available: skeleton first, open it, then one section per call) so the user understands the whole PR and what will be posted before anything goes to GitHub.

Sections, in this order:

1. **Summary**: the recommended verdict, then one table: # · Blocker / Suggestion / Question · one line · `file:line`.
2. **What the PR does**: each change as a numbered item, plus a diagram of the real mechanism it touches (call path, job lifecycle, where data lands). Mark what is new or changed.
3. **One section per comment that will post**: what goes wrong, the evidence and how sure (code read, logs, library source, alert config), the fix, a diagram or table whenever the point has a shape (which call to wrap, before/after of where data goes), and the draft comment quoted.
4. **Kept out of GitHub**: a table of the other verified findings (finding · why it matters · where).
5. **Sources**: PR, paired PR, library versions read, alert or deploy files.

Diagrams follow the `mr-work` skill's `references/visuals.md`: real names from code you read, one idea each, and a screenshot read of each before moving on. Same safety rules: no personal or health data, payloads, tokens.

Keep the doc in step with the review. When wording or the verdict changes, update the summary and the quoted comments; after posting, the quotes become "Posted comment" and the summary carries the verdict and the review link.

### 7. Deliver the review

**Draft first, post second.** Show the full draft in chat (body, every comment, verdict) and wait for the user's go. Wording usually changes before findings do, and a posted comment is public.

**Verify before you claim.** A wrong claim in a review costs more trust than a missed finding. Only findings `mr-skeptic` returned CONFIRMED (or that you traced to the line yourself) get posted; anything softer is phrased as a question. A rewording drifts from the finding it came from (a draft once said all reply bodies were stored before the PR; only one provider's was), so once the wording is settled, run the accuracy gate in the `mr-work` skill's `references/writing.md` on the final text: every factual sentence against the head SHA, and each claim that changed since verification back to `mr-skeptic` (one call per claim, in parallel). REFUTED: fix or drop before the user sees it.

**Don't repeat the thread.** Drop anything already raised in an existing review comment. If you agree with one, say so in that thread (or react), not in a new comment.

**Blocker or suggestion.** Only a real blocker blocks. When unsure, it is a suggestion. Each comment starts with its bold label, so the author can tell severity at a glance:

- `**Blocker:**` the change as merged breaks something a user or operator hits (wrong result, error page, an action that reports success when it failed), misses an acceptance criterion, breaks a consumer contract, loses or corrupts data, or exposes personal data (confirmed, not suspected).
- `**Suggestion (non-blocking):**` anything else worth the author's time: a silent failure in a path that otherwise works, code that doesn't do what the PR body claims, a risky default.
- `**Question:**` something you genuinely don't know: a behaviour the author may not have intended, or a risk you could not prove (unproven data exposure). At most one per PR. Never a fix dressed up as a question.

Nits are never posted.

Never post, even when true: requests to split small unrelated changes into another PR, convention nits (import source, comment length, naming), "add tests for X" unless the missing test hides a real bug, "document this in the PR description", low-priority hardening (validation caps, error wording, log format), copy or grammar fixes. Aim for about four comments per PR; above six, re-check each against this list.

**Write for the author.** Direct, brief and transparent, in first person, about the code and never the person. Each comment has this shape:

````markdown
**Suggestion (non-blocking):** if a queue can't be cleaned, it's only logged and the job still completes, so nothing reaches the error tracker.

Report it before moving on:

```suggestion
      errorTracker.captureException(error);
```

From reading the code, not the logs.
````

1. **Label + what goes wrong and why**, concretely, with the one number or line that proves it (an alert threshold, a timeout). When the cause sits outside the commented hunk, add a permalink on its own line (`https://github.com/<o>/<r>/blob/<head-sha>/<path>#L10-L14`) so GitHub renders the snippet.
2. **The fix, stated plainly**: "This needs X." A one-hunk change goes in a `suggestion` block the author can commit in one click (it replaces exactly the commented line range, so anchor the comment on those lines). A bigger fix is one sentence, not a code dump.
3. **How you know**, once, when it isn't obvious: "Reproduced locally", "From reading the code, not the logs". Longer proof (repro steps, a query) goes in `<details><summary>How I checked</summary>…</details>`.

No rule-file citations. Keep a code reference only when it points at the fix. The same bug in a sibling file is "Same at line 120" or "Same in `x.ts`", not a second comment. Tone rules and GitHub syntax: the `mr-work` skill's `references/writing.md`.

**Review body.** One thank-you line naming one specific thing done well, then a numbered list with one bold sentence per inline comment, in the same order, file and line in brackets, each prefixed with its label. When approving: "Approving; a few non-blocking suggestions:" before the list. When requesting changes: open with a `> [!IMPORTANT]` alert naming the blocker in one line, then blockers first, then suggestions. Nothing else. When paired PRs share a bug, the comment goes where the fix belongs and the other PR's body gets one line pointing there.

**Lint and preview.** Write the review to `review.json` (shape in [`references/posting.md`](references/posting.md)), run the `mr-work` skill's `scripts/draft-lint.py review.json`, and fix everything it flags before showing the draft.

**Verdict.**

- **Approve** with the comments when nothing posted is a blocker.
- **Request changes** only with at least one real blocker in that PR's own code. A paired PR whose code is fine gets approved even when its partner has a blocker; its body points to the partner. Request changes on both only when the clean one can ship on its own and would expose the break (when the UI cannot work without the backend's endpoints, blocking it only adds noise).
- **Comment** only when the user asks, or when an open question decides whether something blocks.

Recommend it with the draft; it is part of what the user confirms.

**Post.** On the user's go, submit the review with its verdict as `event` (`APPROVE`, `REQUEST_CHANGES` or `COMMENT`); the author sees it at once. Post as `PENDING` (no `event`) only when the user wants to submit it themselves. Then update the doc and remove the worktree. Mechanics and gotchas: [`references/posting.md`](references/posting.md).

### 8. Re-review

When the author pushed after the user's review ("re-review #n", or step 1 found their earlier review):

1. The fixed point is the `commit_id` of the user's last review, not the base. Review only `<commit_id>..<head>`.
2. Pull their threads (GraphQL `reviewThreads`, query in [`references/posting.md`](references/posting.md)) and give each unresolved one a row:

   | Thread | Status | Evidence |
   | --- | --- | --- |
   | Errors only logged (`clean.ts`) | Fixed / Not fixed / Answered / Disagreed | the commit or reply that decides it |

   **Fixed** means the problem is gone, not only that the line changed; check with `mr-skeptic` when that isn't obvious.
3. Draft the replies:
   - **Fixed**: reply "Fixed in <commit link>, thanks." and resolve the thread.
   - **Not fixed**: no new comment; it goes back into the review body list.
   - **Answered or Disagreed**: if the reason holds, one line accepting it ("Makes sense, leaving it."); if it doesn't, one reply with the evidence. Anything that decides the verdict goes to the user first.
4. New findings come only from the incremental diff, through steps 3 to 7.
5. Verdict: Approve once no blocker is left open. Same rule as step 7: the user sees every reply, resolve and the verdict before anything posts.

Replying to reviewers on the user's own PRs is in the `mr-pr` skill's `references/responding.md`.

## Why separate passes

A change can pass one pass and fail another:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately in chat stops one pass from masking another. What gets posted is then picked across all of them by severity (step 7).
