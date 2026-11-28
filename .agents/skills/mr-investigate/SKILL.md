---
name: mr-investigate
description: >-
  Evidence loop for a production or staging problem - a bug, an error-tracker alert, a failing
  flow, "is it live". Pulls the ticket and what is deployed, then iterates hypothesis → cheapest
  evidence (error tracker, logs, code) → confirmed or refuted until a cause is pinned to code or
  config. Use when the user asks to investigate, debug, find out why, check an alert or error, or
  says something is broken. Verifying a deployed ticket is `/mr-verify`.
argument-hint: "<ticket> | <error-tracker issue> | <symptom>"
---

The goal is a cause you can point at - a line of code, a config value, a missing deploy - backed by evidence the user can re-check. A plausible story is not a result.

Where to look comes from the Project facts: **Error tracker**, **Logs**, **Environments**, **Tracker**. No fact for a source means skip that source and say so.

## Ground first

When there is a ticket, run `/mr-ticket` steps 1 to 3: what was asked, what was written, what is live. Step 3 decides which environment can show the problem at all; investigating an environment that does not run the code wastes the run. Without a ticket, establish the same three things from the symptom: which service, which environment, which release.

## The loop

Keep a ledger in the ticket's plan file under `## Investigation` (the path the `mr-work` skill's `scripts/plan-path.sh <ticket>` prints, in the main checkout; gitignored; create the file if needed, or use the scratchpad when there is no ticket). One row per hypothesis: the claim, the evidence that would confirm or refute it, what the evidence showed, verdict.

Each round: list the competing hypotheses (at least two when the cause is not obvious, including the boring ones: not deployed, wrong error-tracker project, missing instrumentation), and dispatch one `mr-evidence` per hypothesis in one message, briefed with service, environment, release, time window and what is already ruled out. Record each return in the ledger, then repeat with what is still open. You keep the ledger and the judgement. Cheapest evidence first:

1. **Error tracker**: the right instance and project for the service ([`references/error-tracker.md`](references/error-tracker.md)). Release and environment tags tell you whether the failing build is the one you think.
2. **Logs**: query recipes, fields, and the access rules are in [`references/logs.md`](references/logs.md). Every environment the **Environments** fact allows reading, no confirmation needed. An error-tracker event's trace id joins straight to the logs.
3. **Code and history**: the code path for the failing request, `git log -S` for when the behaviour changed, the PR that changed it.

Stop when one of these holds:
- a cause is tied to a specific line or config value, the evidence explains every symptom seen (not just the first one), and `mr-skeptic` given the cause and its evidence returns CONFIRMED;
- the next piece of evidence needs access the user does not have: name the permission, why it settles the question, and draft the access request text;
- the problem needs a local reproduction to pin down: hand off to a local debugging session with the ledger as its starting point.

A missing signal is ambiguous (no instrumentation, wrong error-tracker project or host, broken delivery, code not deployed). Rule those out before concluding the code is at fault.

## Verify mode

`verify <ticket>` is `/mr-verify <ticket>`; run that instead.

## Report

Use What / Why / How / Evidence / Next (`/mr-work`). Lead with the cause (or "not found, here is what is ruled out"), then the evidence trail from the ledger. For more than three hypotheses or a multi-service cause, offer an investigation board (hypotheses, evidence, error timeline) per the `mr-work` skill's `references/visuals.md`. Every ledger row and every report claim carries its link (error-tracker issue URL, logs query URL, PR or commit URL), and the report ends with a `Sources` list. Then the proposed next step: a fix plan for `/mr-plan`, a ticket comment for `/mr-ticket` step 5 (the "Investigation result" template in the `mr-work` skill's `references/writing.md`, evidence in an expand), or the access request. Auth headers and tokens from logs never appear in the report.
