---
name: mrashidi-review
description: >-
  Reviews a mrashidi.me branch or PR: house-review against the house rules and
  accepted records, then the site gates: PR template, slices, Ask MR privacy,
  endpoints, sitemap and OG images, vendored rules. Use when reviewing a PR, a
  branch, or work in progress before merging.
disable-model-invocation: false
---

# mrashidi.me review

A front end for [house-review](../house-review/SKILL.md). It supplies the inputs, then adds the
gates the generic pass does not check.

## 1. Inputs

- **Diff:** `git fetch origin main`, then `git diff origin/main...HEAD` (or `gh pr diff <n>`).
- **Spec:** the GitHub issue from `Fixes #n` in the PR body (`gh issue view <n>`), or the user's request. For a PR, `gh pr view <n>`.
- **Standards:** [house rules](../../house-rules.md), [AGENTS.md](../../../AGENTS.md), accepted records in [`docs/decisions/`](../../../docs/decisions/README.md), [stack.md](../../../docs/agent/stack.md).

## 2. House review

Run [house-review](../house-review/SKILL.md) with those inputs.

## 3. Site gates

Report as a pass/fail table after the house-review findings.

| Gate | Check |
| ---- | ----- |
| PR body | [Template](../../../.github/pull_request_template.md) sections in order; Breaking Changes and Affected Endpoints only when the diff warrants them; `Fixes #n` one per line in References; no agent attribution |
| Commits | One line each, conventional, no body or trailers; cleanup in its own commit |
| Slices | New code in `src/features/<feature>/`; route files thin; no import into another feature except its `index.ts` ([DR-0002](../../../docs/decisions/0002-feature-slices.md)) |
| Endpoints | Every changed `src/app/api/**/route.ts` listed under Affected Endpoints; input validated with Zod at the route |
| Ask MR | `askMrKnowledge.ts` or the system prompt changed → nothing private added ([DR-0004](../../../docs/decisions/0004-ask-mr-grounded-public-knowledge.md)), knowledge tests pass, `pnpm eval:ask-mr` run or explained |
| Pages | A page added, renamed, or removed → metadata in `pageMetadataConfigs`, sitemap and OG images regenerated |
| Vendored rules | `.agents/house-rules.md` and `.agents/skills/house-*` changed only through `pnpm house-rules:sync`, with the lock file |
| Gate | How to Test ends with `pnpm gate`; `gh pr checks` green |

## Output

House-review findings, then the gates table, then a verdict: merge-ready, needs changes (list
them), or blocked on a question for the author.

## Do not

- Merge, approve, or close the PR
- Push fixes unless the user asks; the deliverable is the review
