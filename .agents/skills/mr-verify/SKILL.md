---
name: mr-verify
description: >-
  Verify a shipped ticket on its environments - prove the release is live, check the error
  tracker and logs for it, reproduce the acceptance criteria in a browser with screenshots and
  video, collect the evidence in one folder, and post a short plain-language report with the
  screenshots embedded in the ticket comment. Use when a ticket has been deployed, or the user
  asks to verify, QA, test on staging or production, monitor a release, or gather evidence that a
  ticket works.
argument-hint: "<ticket> [<environment>]"
---

The goal is evidence a teammate can re-check: every acceptance criterion gets a verdict per environment, and every verdict points at a file in the evidence folder. "Looks fine" without a file is not a verdict.

Environments, their URLs, how to tell which release is live, and which ones are read-only come from the **Environments** Project fact. Default to every environment it lists; an argument narrows it to one.

## 1. Ground

Run `/mr-ticket` steps 1 to 3: the acceptance criteria, the merged PRs and their diffs, and which release reached which environment. Per environment, the change is either live (the version query in the `mr-investigate` skill's `references/logs.md` shows the new release on every touched service) or not. An environment without the change gets ⏳ on every row and nothing else is checked there.

The diff names the observables: the route, status code, log message, event name, UI text. Use those, not a guess at what the ticket meant.

## 2. Test plan

Add `## Verification` to the ticket's plan file (the path the `mr-work` skill's `scripts/plan-path.sh <ticket>` prints, in the main checkout; gitignored; create it if missing). One row per acceptance criterion, plus one row for "nothing new broke":

| AC | How it is observed | Env | Verdict | Evidence |
| --- | --- | --- | --- | --- |

Pick the cheapest observation that settles each criterion: a read-only HTTP request, then a log or error-tracker signal the diff introduced, then the browser. Only UI-visible criteria need the browser.

## 3. Collect evidence

Evidence lives next to the plan in `docs/plans/<ticket>-evidence/<env>/`, with an `INDEX.md` listing each file and the criterion it proves. Saved outputs are trimmed to the fields that matter; auth headers, tokens, and anything about a real person (users, patients, customers) stay out.

**Health of the release** (every live environment, one `mr-evidence` per environment in one message): new error-tracker issues for the release, error and 5xx lines on the touched services and routes since the rollout, and the diff's own log signal firing. Commands and traps: the `mr-investigate` skill's `references/logs.md` and `references/error-tracker.md`. An error-tracker issue or 5xx tied to the change is ❌ and goes to `/mr-investigate`; verifying stops for that criterion rather than debugging here.

**Repro** (no organic traffic exercised the change since rollout, or the criterion is UI-visible): when the project has an end-to-end suite (the **Stack doc** or **Environments** fact names it), reuse its page objects, login and fixtures. Write a throwaway spec at `tests/_verify/<ticket>.spec.ts` built from those pieces, with `test.use({ channel: 'chrome', video: 'on', screenshot: 'on', trace: 'on' })` and a `page.screenshot` at each criterion's checkpoint, named `ac1-<what>.png`. `channel: 'chrome'` drives the installed Google Chrome, so no Playwright browser download is needed. Backend criteria are driven through the API with the suite's request helper, and the proof is the request's trace in the logs, not a screenshot.

Prefer the suite's existing test accounts and fixtures to creating data; when a flow needs state that is expensive to create (a booking, a connection between two accounts), use the accounts the **Environments** fact names for it. Data the spec creates is deleted in a `finally`.

A screenshot is evidence only when it shows the thing: check it before filing it (a calendar that opens at 08:00 puts a later slot below the fold).

**Repro with the user's own accounts** (when the fact names personal test accounts, or the user offers): the user logs in, Claude drives both sides through Claude in Chrome. Put each role in its own connected browser and switch with `select_browser` before acting on the other side's tab. Use the product's own screens, take a cropped `zoom` with `save_to_disk` at each step, and copy it into `<env>/ui/` with a numbered name. Line each step up with its log lines for the evidence folder. Consent boxes and anything that acts in the user's name are the user's to click. Undo what the test created at the end (cancel the test appointment, delete the test record) through the product.

Run the suite's command for a single folder (the **Stack doc** names it), against the base URLs its own config sets. That config usually holds credentials, so the run uses it and its values stay unread. Copy the screenshots, `video.webm`, and `trace.zip` from the suite's output folder into the evidence folder.

Read-only environments: a separate spec that visits absolute URLs from the **Environments** fact logged out, using plain `page` rather than the login fixtures. Logging in, submitting a form, or creating anything there waits for the user's explicit yes in this session.

When the run is done, offer to turn the spec into a real regression test; otherwise delete it.

A backend-only ticket skips the browser and says so in the report.

## 4. Verdicts

Every row ends with one of:

- ✅ verified, with the evidence file
- ⏳ not on this environment yet
- ❓ unverifiable: name the access or data that would settle it
- ❌ failed: hand to `/mr-investigate` with the evidence

The step is done when no row is blank. Update the plan's Status (`Phase: 7 Verify`, and which environments are still ⏳).

## 5. Report

Write it for a person, not an engineer: plain sentences, first person, no hashes, metric names, log lines or file references, no em dashes. Shape, what to leave out, and a worked example: [`references/report.md`](references/report.md).

First run the accuracy gate and the `mr-work` skill's `scripts/draft-lint.py` (rules in its `references/writing.md`) before showing the draft. Then show the draft and the chosen screenshots to the user. On their OK, post it as a ticket comment through the tracker adapter for the **Tracker** fact (the `mr-ticket` skill's references). A correction to the same report edits that comment, never a second comment.

When the tracker's CLI cannot embed media (Jira through `acli`, for one), post in two passes:

1. **Text**, converted as the adapter says (for Jira, the `mr-ticket` skill's `scripts/md2adf.py`), ending with the "Screenshots: ..." line.
2. **Screenshots inline**, in the browser. Copy the 4 to 6 numbered images into the scratchpad first (Chrome's `file_upload` only reads session folders, not `docs/plans`). Open the ticket in Chrome, click the comment's **Edit**, click the end of the last line, `cmd+End`, `Return`, then `find` the editor's `type=file` input and `file_upload` all images to it in order. Wait a few seconds for the previews, then **Save**. Uploading through the editor also attaches them to the ticket, so never attach them separately first: that leaves duplicates.

Check it landed: the ticket's last comment shows one embedded image per screenshot, and the ticket's attachments are only those images. Log files, traces and camera screenshots stay in the local evidence folder. Replacing an earlier post: edit the text, delete its old attachments, then the browser pass.

Transitions and release labels wait for the user to ask.

## Monitoring

`/loop 15m /mr-verify <ticket>` re-runs until every row on every environment has a final verdict (✅, ❓, or ❌), then stops. A tick starts with the `mr-ticket` skill's `scripts/shipped.sh <ticket> <owner>`: when every open row is ⏳ and its output equals the copy saved as `.shipped` in the evidence folder, the tick ends with one line ("no new release") and runs nothing else; otherwise save the new output and carry on. Typical arc: the first environment verified first, later rows ⏳ until the release reaches them.
