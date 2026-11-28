# Reviewer lessons

Lessons from real reviews that hold in any project. `mr-standards` applies them as written
standards. A lesson about one project's code or conventions belongs in that project's rules, not
here (see [`references/calibration.md`](references/calibration.md)).

From human reviewers' changes-requested comments:

- Errors surface. A catch either rethrows, translates to a safe API error, or reports to the error tracker. "Worse than having errors is not knowing they happen."
- The application service collects the data (user, entities) and hands it to domain services; domain services do not fetch what the caller already holds.
- Entities are named after the thing, not its owner: `EncryptionKey` with an `owner` column, not `MemberKey`.
- Queue only validated work: check the ids exist before enqueueing them.
- Generate inline when the batch is small; queue only for a measured need.

From the user's own review rewrites:

- Post only what needs fixing; the full report stays in chat.
- Small unrelated changes in a PR are fine; don't ask for a separate PR.
- Comment = what the user sees go wrong, why in plain words, the fix stated plainly (a `suggestion` block when it's one hunk). Questions only for what you genuinely don't know. No library internals.
- Paired PRs: test the wire format between them with the real client, not the types.
- Check whether a security finding predates the diff before posting it.
