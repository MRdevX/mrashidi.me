# Answering reviewers on the user's PRs

Every review comment gets an answer in its thread, after the push that addresses it, so the reviewer can check the fix where they raised it. Tone, accuracy gate and lint: the `mr-work` skill's `references/writing.md`. Mechanics: the `mr-review` skill's `references/posting.md` (threads section).

| Reviewer comment | Reply |
| --- | --- |
| Right, fixed | "Fixed in [abc1234](commit url)." One more sentence only if the fix differs from what they suggested. Let the reviewer resolve it. |
| Right, but not in this PR | "Agreed, tracked in [ABC-123](https://…)." Create the ticket first; never "will do later" without one. |
| Disagree | One sentence why, with the proof (permalink, test, doc link, measurement), then "Does that cover it?". No second round in the thread: if it's still open, talk it through and post the outcome. |
| Question | Answer it plainly. If the code should have made it obvious, change the code (a name, a one-line comment) and say so. |
| Nit you accept | Fix it, reply "Done." No discussion. |

Rules:

- Thank once in the summary, not in every thread.
- Never "Done" without the commit link when the fix is a code change; the link is the proof.
- Same accuracy gate as outbound reviews: a reply saying "this can't happen" needs the line that proves it.
- With 3 or more threads, add one PR comment after the push: `**Addressed all comments:** 4 fixed, 1 moved to [ABC-123](https://…), 1 answered.` Skip it for fewer.
- Re-request review (`gh pr edit <n> --add-reviewer <login>`) only after every thread has an answer.
- Every reply is shown to the user before it posts.
