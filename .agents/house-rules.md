# House rules

These rules apply to every project. A project's own `AGENTS.md` adds facts (stack, commands,
paths) and may tighten a rule, never loosen one. An `accepted` decision record in the project
outranks these rules and your own judgement.

Canonical source: the `house-rules` repo (`github.com/MRdevX/house-rules`). Projects vendor a
copy into `.agents/` with `house-rules sync`; edit the source repo, never the copy. Rationale:
`decisions/` in that repo.

## 1. Architecture: vertical slices, tactical DDD inside

- Organise by feature or domain first, by technical layer second. Everything one feature needs
  (domain, use cases, adapters, UI, tests) lives under that feature's folder. Where slices live
  in each app is the **Slice layout** in Project facts.
- Inside a slice, dependencies point inward: interface (HTTP, UI) → application → domain.
  Infrastructure implements ports the application owns. Composition wires them; nothing else
  constructs adapters.
- Domain code is plain language code: no framework, ORM, HTTP, or platform imports. Invariants
  live on the entity or value object that owns them, not in a route or component.
- One use case is one command or query with one entry point. Commands change state, queries
  don't.
- Validate untrusted input once, at the boundary. Inside, trust the types.
- A slice does not import another slice's internals. It goes through that slice's public entry
  or a shared package.
- Promote code to a shared package only when a second real consumer exists.

## 2. Simplicity: KISS, YAGNI, DRY, clean code

- Build what the task needs today. No speculative options, flags, generic parameters, plugin
  points, or "for later" abstractions.
- DRY is about knowledge, not look-alike lines. One rule, constant, or type has one home.
  Duplicate code is fine until the third copy, or until two copies must change together.
- Prefer the simplest construct that works: a function over a class, data over configuration,
  the platform API over a wrapper.
- Names carry intent. A function does one thing at one level of abstraction. Return early;
  avoid nested conditionals and boolean parameters that switch behaviour.
- No dead code: unused exports, files, dependencies, feature flags, and commented-out code are
  deleted. Git keeps history.
- Errors are explicit: typed results or domain errors, mapped to transport errors at the
  boundary. Never swallow an error silently.

## 3. Comments: none by default

- New code ships without comments. A comment is allowed only for something the code cannot
  say and that costs real time to get wrong:
  - a constraint from outside the file (platform limit, vendor behaviour, wire format),
  - why the obvious approach was rejected,
  - deliberate ordering or timing that looks accidental,
  - a value that is intentionally empty, null, or disabled.
- Doc blocks follow the same bar. A doc block that restates the name is deleted.
- Before writing a comment, try a better name, an extracted function, or a named constant.
- Tool directives (`biome-ignore`, `@ts-expect-error`, triple-slash references) and API
  contract text (OpenAPI, Zod descriptions) are not comments and stay.
- `TODO` needs an issue reference (`TODO(#123)`, `TODO(MAS-123)`), or it is deleted.
- Knowledge removed from comments goes to a test name, a decision record, or a docs page.
- Skill: `house-comments`.

## 4. Frameworks: official docs first

- Before using a framework or library API, read the official docs for the version pinned in
  the lockfile. Do not rely on memory; APIs change between majors.
- Use the framework's conventions (file layout, data fetching, routing, config) instead of
  inventing your own. Deviate only with a decision record or a note in the project's stack doc.
- The project lists its stack, pinned versions, doc links, and house conventions in the
  **Stack doc** named in Project facts.

## 5. Decisions are written down

- Before feature work, skim the decision index and search it for the area you touch.
- An `accepted` record is binding. If it is wrong, say so and write a superseding record in the
  same change; never quietly contradict it.
- Write a record when a change is hard to reverse, cross-cutting, non-obvious, or expensive to
  re-derive. Not for routine features, fixes, copy, or dependency bumps.
- Records are immutable once accepted. Current behaviour is described in `docs/`, which is
  rewritten in place.
- Skill: `house-decision`.

## 6. Leave it better: boy-scout refactoring

- Files you touch are left matching these rules: dead code removed, comments that fail the bar
  removed, real duplication extracted, names fixed.
- Cleanup goes in its own commit in the same PR. Never mix cleanup with behaviour changes in
  one commit.
- Stay inside the files and slice the task touches. Repo-wide refactors happen only when
  cleanup is the task.
- Skill: `house-cleanup`.

## 7. Change hygiene

- Conventional commits: `type(scope): summary` (`feat`, `fix`, `refactor`, `docs`, `chore`,
  `test`, `perf`, `ci`, `build`). One concern per commit.
- A commit message is one line: the title only, no body, no trailers. No agent attribution
  (`Co-Authored-By`, `Generated with …`). The summary is plain, natural wording that says what
  changed for a reader of `git log --oneline`: `fix(api): stop duplicate reminder emails`, not
  `fix(api): update reminder service logic`. Context that needs more than a line goes in the
  PR body or a decision record.
- Tests prove behaviour through public interfaces. Name the test after the guarantee.
- Run the project gate before pushing. Never skip hooks or force-push the default branch unless
  asked.
- Never commit secrets, `.env` files, or generated credentials.
- Pull requests use the house format. Skill: `house-pr`. Review with `house-review`.

## 8. Project facts the house skills read

Each project's `AGENTS.md` has a **Project facts** section with:

| Fact | Example |
| ---- | ------- |
| Gate | `pnpm ci:affected` |
| Issue reference | `Fixes #123`, one per line, at the end of the Overview |
| Extra PR sections | `References` after How to Test, or none |
| Endpoint sources | `apps/api/src/interfaces/http/routes/` |
| Slice layout | API `src/modules/<context>/`, web `features/<feature>/` |
| Decision records | `docs/decisions/`, files named `NNNN-short-slug.md` |
| Stack doc | `docs/agent/stack.md` |
