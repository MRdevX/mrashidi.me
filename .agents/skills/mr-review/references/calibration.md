# Review calibration

`/mr-review calibrate <since>` (a date, usually the sprint start). Chat only: nothing is posted.

Run the skill's `scripts/review-outcomes.sh <sprint-start> [owner]` and classify each thread:

- **Accepted**: outdated (the line changed) or resolved after a change, or a reply like "Done".
- **Pushed back**: the author disagreed or explained it away, and nothing changed.
- **Ignored**: merged unchanged with no reply.

Show the user the acceptance rate per label (Blocker / Suggestion / Question / none), every pushed-back or ignored comment quoted with its link, and 0 to 3 proposed lessons ("Stop posting X", "Y lands well"), each citing the threads behind it. A thread where the author agreed but deferred to another PR or ticket counts as accepted.

Add only the lines the user approves, and put each where it belongs:

- A lesson about reviewing in general goes in [`reviewer-lessons.md`](../reviewer-lessons.md), under `From calibration (<date>)`.
- A lesson about one project's code or conventions goes in that project's rules (`.claude/rules/` or its untracked `CLAUDE.local.md`), never here: this skill is shared across projects and owners.

Also propose which smells in `mr-standards` to drop or bring back, from the same threads.
