# Contributing

Thanks for your interest in contributing. This project uses **Conventional Commits** and **Semantic Versioning** for clear history and automated releases.

## Rules

This project follows the shared house rules ([`.agents/house-rules.md`](.agents/house-rules.md)),
plus the project facts and specifics in [`AGENTS.md`](AGENTS.md). Before feature work, check the
[decision records](docs/decisions/README.md) for the area you touch.

## Local checks (before you push)

Use **Node** and **pnpm** versions that match [`package.json`](package.json) `engines`.

- Copy environment template: `cp .env.example .env.local` then fill values as needed for local features (contact, blog, etc.).
- **`pnpm gate`** — Biome, agent tooling check, typecheck, and unit tests. Pre-push runs it; CI runs the same steps.
- **`pnpm build:fast`** — Next.js production build only (quick smoke; skips PWA and does not run sitemap/OG generation).
- **`pnpm build`** — Full production pipeline including sitemap and OG scripts; heavier and may require secrets those scripts expect.

## Commit messages

A commit message is one [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) line, `type(scope): summary`,
with no body and no trailers. commitlint enforces it. Context that needs more than a line goes in the PR body or a
decision record.

| Type       | Description                    | Version impact      |
| ---------- | ------------------------------ | ------------------- |
| `feat`     | New feature                    | **MINOR** bump      |
| `fix`      | Bug fix                        | **PATCH** bump      |
| `docs`     | Documentation only             | No version bump     |
| `refactor` | Code change, no fix/feat       | No version bump     |
| `perf`     | Performance improvement        | No version bump     |
| `test`     | Adding or updating tests       | No version bump     |
| `build`    | Build system / dependencies    | No version bump     |
| `ci`       | CI configuration               | No version bump     |
| `chore`    | Other changes (e.g. tooling)   | No version bump     |

Mark a breaking change with `!` (`feat(api)!: accept JSON on the contact endpoint`) and describe the migration in the
PR's Breaking Changes section.

```
feat(blog): add RSS feed for posts
fix(contact): validate email before submit
docs: update README quick start
chore(deps): bump next to 16.1.6
```

## Pull requests

PR bodies follow [`.github/pull_request_template.md`](.github/pull_request_template.md); the `house-pr` skill writes one.

## Releases

- Releases are created **automatically** when changes are merged to `main` (see [README#Releases](README.md#releases)).
- For a **local dry-run** (see next version and changelog without committing): `pnpm release --dry-run`.
- To cut a release locally (bump version, update CHANGELOG, commit): `pnpm release` (normally used by CI).
