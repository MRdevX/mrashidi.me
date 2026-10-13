---
id: 0003
title: Lint and format with Biome only
issues: []
status: accepted
date: 2025-08-27
supersedes: []
superseded_by: []
related: []
areas: [tooling, ci]
---

# DR-0003: Lint and format with Biome only

> Biome is the only linter and formatter. `biome.json` holds the rules; `pnpm check` runs it
> locally, lint-staged runs it on commit, and CI runs it with the GitHub reporter. Don't add
> ESLint, Prettier, or their plugins.

## Context

The site linted with ESLint until 2025-08-27, when `fb40815` replaced the ESLint config with
Biome. This record was written on 2026-10-13, when the decision log started, so it describes
the choice as made then and kept since. The ESLint setup needed a CLI migration and separate
ignore rules for scripts the week it was dropped (`8bfb419`, `d58c23d`).

## Decision

- `biome.json` is the single lint and format config, including import ordering.
- Formatting: 2 spaces, 120 columns, double quotes, ES5 trailing commas.
- `pnpm check` / `pnpm check:fix`; CI runs `biome check . --reporter=github`.
- Vendored files in `.agents/` are excluded so the tool never rewrites them.

## Consequences

- **Gains:** one fast tool, one config, one command for lint, format, and imports.
- **Costs:** no access to ESLint plugins, including `eslint-config-next` and its Next-specific
  rules.
- **Accepted risks:** a Next.js mistake that only an ESLint rule would catch. Review and the
  Next docs cover it.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| ESLint and Prettier | Two tools and configs to keep in sync; the setup this replaced |
| ESLint with `eslint-config-next` alongside Biome | Two linters disagreeing over the same files |

## Implementation

- [x] `biome.json`, `package.json` scripts, `lint-staged`, `.github/workflows/ci.yml`

## Revisit when

- Next.js ships a rule set that catches real bugs and runs only on ESLint.
