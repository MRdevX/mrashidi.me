# Verification report

The reader is a teammate or PM skimming the ticket, not an engineer reading logs. They want three things in order: does it work, what did you do to know, what is still open. The evidence folder is for engineers and stays local; the comment is for people.

## Shape

1. **Verdict line**, bold, naming the environment: "Tested on staging: works." Then one sentence on what now happens for the user, in product words.
2. **What I did**: with 2 or more acceptance criteria or environments, a table first (`Criterion | <env> | <env>`, cells ✅ ❌ ⏳ ❓), then 3 to 5 bullets, each one action and what you saw, the way you'd tell it at standup. Say whose accounts you used.
3. **Health**: one sentence. "No new errors on staging since the release."
4. **Still open** (only when a row is ❓ or ⏳): what is not checked, in user terms, and when it will be.
5. **Screenshots**: one line saying what the pictures show, in order, then the images embedded right below it.

Aim for ~15 lines of text. Tone, noise list and self-check: the `mr-work` skill's `references/writing.md`.

## Leave out

All of this stays in the evidence folder, never in the comment:

- commit hashes, release tags, PR numbers in the verdict line
- metric names, log messages, routes, status codes, UUIDs, timestamps in UTC
- file names like `ac1-dropdown.png` or references to evidence files
- attached log, trace, JSON, or text files
- a footer with environment, release, and date

## Screenshots

4 to 6, each showing one step the bullets describe, in the order they happen. Name them `1-<what>.png`, `2-<what>.png` so they sort in that order. Crop to the part that proves the point (a card, a button), not the whole page.

Never post a screenshot that shows the user's camera, face, or anything personal; keep those local and say "I left out the in-call screenshots" if the call itself was the proof. Codes from a cancelled test session are fine to show.

They go into the comment inline, not as loose attachments: steps in [`../SKILL.md`](../SKILL.md) section 5.

## Example

> **Tested on staging: works.** When an appointment is moved after the reminder already went out, both people now get a new reminder with the access code, and they can join the call at the new time.
>
> **What I did** (with my own test host and guest accounts)
> - Booked an online session. The reminder with the code arrived right away.
> - Changed only the description. No extra reminder was sent, which is correct.
> - Moved the session twice to a new time. Each time both of us got the "appointment changed" mail and a new reminder with the code a minute later, and the guest's page showed the new time.
> - At the new time, both of us got the join button, entered the call, and saw each other.
>
> No new errors on staging since the release.
>
> **Still open:** sessions that were already broken before this fix (codes already deleted) should repair themselves. I can't recreate that on staging, so I'll check it on production after the next release.
>
> Screenshots: the guest's page at 14:00, after the move to 15:00 and after the move to 11:55; the join button for the guest and for the host; the host in the call.
>
> _(six images embedded here)_

## Posting

Write the report as Markdown; the `.md` is what the user approves. Convert it the way the tracker adapter says (for Jira, the `mr-ticket` skill's `scripts/md2adf.py report.md > report.json`). The text goes up through the tracker's CLI; the images are added afterwards in the browser when the CLI cannot embed media.
