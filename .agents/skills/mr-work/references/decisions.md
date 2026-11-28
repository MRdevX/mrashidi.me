# Putting a decision to the user

A decision is anything with more than one reasonable answer whose trade-off is the user's to weigh: scope, data shape, rollout, contract changes, which fix. Facts (what the code does, what is deployed, what the logs say) are fetched first, never asked.

## In chat: one block per decision

```markdown
### D2 · Where the retry lives

Context: one or two sentences on why this is open, with the fact that forced it (path:line, log count).

| Option | Pros | Cons | Risk | Effort |
| --- | --- | --- | --- | --- |
| **A. In the consumer (recommended)** | ... | ... | low: ... | S |
| B. In the producer | ... | ... | medium: ... | M |
| C. Leave as is | ... | ... | ... | none |

Recommendation: A, because <the one reason that decides it>.
Against it: <strongest case against A, from mr-skeptic when the decision is high-risk>.
Reversible: yes/no, and what undoing it costs.
```

- Two to four options. Always include "leave as is" or "defer" when that is a real choice.
- Pros and cons are concrete: a failure mode, a caller, a rule, a number. Not "more maintainable".
- Risk names what breaks and for whom. Effort is S/M/L in this codebase's terms.
- A decision that depends on another open one waits for the next round.

## Then: AskUserQuestion

Right after the blocks, one AskUserQuestion with up to four of them. Each question names the decision (D2) so it stands on its own, the recommended option is first with "(Recommended)" in its label, and descriptions carry the one-line trade-off. Code or diagram alternatives go in `preview`.

More than four open: ask the four that unblock the most, list the rest as "next round".

## After the answer

Write each decision into the plan under `## Decisions`: decision, why, alternative rejected. A recommendation the user overrode is recorded with their reason.
