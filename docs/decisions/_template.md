---
id: NNNN
title: Imperative phrase naming the decision
issues: []              # GitHub issues, e.g. ["#123"], parent first. [] if none.
status: proposed        # proposed | accepted | superseded | reverted
date: YYYY-MM-DD
supersedes: []          # ["DR-0004"]
superseded_by: []       # ["DR-0011"]
related: []             # ["DR-0002"]: records this one amends or builds on
areas: []               # app | api | ask-mr | ci | infra | tooling
---

# DR-NNNN: <title>

> One paragraph: what was decided and why. Someone who reads only this box should be able
> to act correctly without reading the rest.

## Context

What forced a decision now, and the constraints that were real rather than hypothetical.
Include evidence with numbers (measurements, costs, limits) and where they came from, so the
next person can re-run them instead of trusting them.

## Decision

What we are doing, stated so it can be complied with. Present tense, specific enough that a
reviewer can hold a PR against it.

## Consequences

Honest, including what got worse.

- **Gains:** …
- **Costs:** …
- **Accepted risks:** … and what we do if one lands

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| … | … |

The option a competent engineer would reach for first belongs in this table with a real
reason. If nothing was rejected, this was not a decision and does not need a record.

## Implementation

Where this lands in the codebase, so the record stays anchored to real files.

- `path/to/file`

## Revisit when

Concrete triggers that would make this decision wrong.

- …
