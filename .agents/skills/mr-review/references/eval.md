# Golden-PR replay

Checks that edits to mr-review, the `mr-work` skill's `references/writing.md`, `reviewer-lessons.md`
or the review agents (`mr-standards`, `mr-spec`, `mr-skeptic`) don't make reviews noisier or less
accurate. Run it after any such edit, and record the score.

## Set

The reference reviews are private to the projects they come from, so none ship with this skill.
They live wherever the optional **Review evals** Project fact points: a folder of
`<repo>-<n>.posted.json` files, each holding what the user actually posted (the reviewed
`commit_id`, the verdict, the body and every inline comment), plus a `SCORES.md` with the table
below. No **Review evals** fact means there is no set on this machine: say so and stop.

Add a PR to the set when the user rewrote a draft substantially before posting: that rewrite is
exactly what the skill should learn to produce.

## Run

0. Stay blind: take only `commit_id` from the posted file (`jq -r .commit_id`). Open its body and
   comments in step 3, after `review.json` exists.
1. Check out the reviewed commit, not the PR head: `git worktree add <scratchpad>/eval-<n> <commit_id>`
   (`git fetch origin <commit_id>` first if needed). The base is the PR's `baseRefName`; the PRs are
   merged, so the fixed point is `git merge-base origin/<base> <commit_id>`.
2. `/mr-review #<n> dry-run` against that worktree. It stops after `review.json` and its lint.
   Count the subagents launched, per type.
3. Compare `review.json` with the posted file, one row per point:

   | Point | Posted | Replay | Match |
   | --- | --- | --- | --- |
   | Errors only logged | yes | yes, Suggestion | ✅ |

4. Score:
   - **Recall**: posted points the replay found (same problem, any wording).
   - **Noise**: replay comments with no posted counterpart. Each is either a real miss in the
     original (say why, with the line) or noise.
   - **Verdict**: same or not. A reference review that predates the "Approve with suggestions"
     rule can still be matched by a replay that approves with the same points; judge by whether a
     real blocker exists.
   - **Form**: labels present, lint clean, each claim traced to a line.
5. Remove the worktree.

A PR whose points `SKILL.md` already quotes is in-sample: use it to compare cost (agent runs), and
an out-of-sample PR for recall. Run the whole set after a large edit.

## Scores

Kept in the set's `SCORES.md`, one row per run:

| Date | Change tested | PRs | Recall | Noise | Verdict match | Agent runs | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

What earlier runs taught, already folded into `SKILL.md`: triage before verifying (one skeptic call
per file cut agent runs from 28 to about 8 at the same recall); only nits and `SMELL` findings are
set aside unverified; the correctness pass adds nothing where the repo has its own auditors; a
dry-run must not read the merged PR body.
