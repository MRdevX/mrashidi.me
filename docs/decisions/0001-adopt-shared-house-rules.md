---
id: 0001
title: Adopt the shared house rules, vendored from their own repo
issues: []
status: accepted
date: 2026-10-13
supersedes: []
superseded_by: []
related: []
areas: [app, api, ask-mr, ci, tooling]
---

# DR-0001: Adopt the shared house rules, vendored from their own repo

> mrashidi.me follows the shared house rules in [`.agents/house-rules.md`](../../.agents/house-rules.md):
> vertical slices, KISS/DRY/YAGNI, no comments by default, official docs first, decision records,
> boy-scout cleanup, one-line commits, and one PR format. The rules and the `house-*` skills are
> copied in by `pnpm house-rules:sync` and never edited here; `pnpm check:agent-tooling` fails if
> the copy drifts. Project specifics live in **Project facts** in [`AGENTS.md`](../../AGENTS.md).

## Context

The site had a 43-line `AGENTS.md` (stack, aliases, commands), three Cursor rules, no PR
template, and no written decisions. Two of the seven aliases it documented (`@server/*`,
`@types/*`) pointed at nothing. The house rules reached the repo only through a global install
on one machine, so Cursor, Codex, CI, and any other checkout never saw them.

masir-app already adopted the same rules (its DR-0045). The owner wants one rule set across
projects, readable from each repo without cloning another. The reasoning behind the generic
rules lives in the house-rules repo: HR-0001 (vendoring), HR-0002 (no comments by default),
HR-0003 (vertical slices), HR-0004 (PR format), HR-0005 (one-line commits). This record covers
how this repo adopts them.

## Decision

- `.agents/house-rules.md` and `.agents/skills/house-*` are vendored copies with sha256 hashes in
  `.agents/house-rules.lock.json`. Change the house-rules repo, then `pnpm house-rules:sync`.
- `pnpm check:agent-tooling` runs in `pnpm gate`, pre-push, and CI. It fails on a hash mismatch,
  a missing `@.agents/house-rules.md` import in `AGENTS.md`, broken skill symlinks, bad skill
  frontmatter, or broken relative links in agent docs.
- `.claude/skills` and `.cursor/skills` are symlinks to `.agents/skills`; `CLAUDE.md` is a symlink
  to `AGENTS.md`.
- The gate is `pnpm gate`: Biome, agent tooling, typecheck, unit tests.
- Comments follow the house bar; a `TODO` needs a GitHub issue, `TODO(#123)`.
- PR bodies follow [`.github/pull_request_template.md`](../../.github/pull_request_template.md):
  the house sections plus `References` last.
- commitlint rejects a commit body or footer. Dependabot commits are exempt, because Dependabot
  writes its own bodies.
- An `accepted` record here outranks the house rules. `AGENTS.md` may tighten a house rule,
  never loosen it.

## Consequences

- **Gains:** one rule set shared with the other projects; every agent host reads the same files;
  drift fails CI instead of going unnoticed.
- **Costs:** a rule change needs a PR upstream and a sync PR here. The commit history before this
  record has multi-line messages and co-author trailers that no longer match the rules.
- **Accepted risks:** a stale copy if nobody syncs. `house-rules:sync` pulls the latest upstream,
  and the lock records the commit it came from.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Global install only (`house-rules install`) | Applies on one machine; CI, Cursor, and other checkouts never see the rules |
| Git submodule | Every clone and worktree needs `git submodule update`; agent worktrees start without it |
| Keep site-local rules | They drift from the other projects within weeks, as masir and r4zzle showed |

## Implementation

- [x] Vendored rules and skills — `.agents/`, `scripts/house-rules.mjs`
- [x] Lock and tooling check — `scripts/check-agent-tooling.mjs`, `.github/workflows/ci.yml`, `.husky/pre-push`
- [x] Project facts — `AGENTS.md`
- [x] Stack doc — `docs/agent/stack.md`
- [x] PR template — `.github/pull_request_template.md`
- [x] One-line commits — `commitlint.config.mjs`, `CONTRIBUTING.md`

## Revisit when

- The site gains a second app or package and needs per-workspace gates.
- Syncing by hand gets skipped; then add a scheduled sync PR (HR-0001).
