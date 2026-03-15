# Contributing

Thanks for your interest in contributing. This project uses **Conventional Commits** and **Semantic Versioning** for clear history and automated releases.

## Commit message format

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                    | Version impact      |
| ---------- | ------------------------------ | ------------------- |
| `feat`     | New feature                    | **MINOR** bump      |
| `fix`      | Bug fix                        | **PATCH** bump      |
| `docs`     | Documentation only             | No version bump     |
| `style`    | Formatting, whitespace         | No version bump     |
| `refactor` | Code change, no fix/feat       | No version bump     |
| `perf`     | Performance improvement        | No version bump     |
| `test`     | Adding or updating tests       | No version bump     |
| `build`    | Build system / dependencies    | No version bump     |
| `ci`       | CI configuration               | No version bump     |
| `chore`    | Other changes (e.g. tooling)   | No version bump     |

Only `feat` and `fix` (and breaking changes) drive the changelog and version bumps. Use them for user- or API-visible changes.

### Breaking changes

- **MAJOR** version bump: use either
  - `feat!: description` or `fix!: description`, or
  - a footer: `BREAKING CHANGE: description`

### Examples

**One-line:**

```
feat(blog): add RSS feed for posts
fix(contact): validate email before submit
docs: update README quick start
chore(deps): bump next to 16.1.6
```

**With body and breaking change:**

```
feat(api): change contact endpoint payload

Use JSON body instead of form-data. Clients must send Content-Type: application/json.

BREAKING CHANGE: Contact API now expects JSON; form-data is no longer supported.
```

## Releases

- Releases are created **automatically** when changes are merged to `main` (see [README#Releases](README.md#releases)).
- For a **local dry-run** (see next version and changelog without committing): `pnpm release --dry-run`.
- To cut a release locally (bump version, update CHANGELOG, commit): `pnpm release` (normally used by CI).
