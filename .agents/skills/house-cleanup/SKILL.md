---
name: house-cleanup
description: >-
  Boy-scout refactoring to the house rules: dead code, unused dependencies, comments,
  duplication, naming, layer leaks. Use when cleaning up, refactoring, removing dead
  code, or tidying files a change already touches.
---

# House cleanup

Leave touched code matching `house-rules.md`, in its own commit, with no behaviour change.

## 1. Scope

- **Boy-scout** (default): only files and the slice your current task touches.
- **Cleanup task**: the packages the user named, or the whole repo if asked.

Write the scope down before starting. Done when you have a file or package list.

## 2. Find dead code

For TypeScript repos, run knip without adding it as a dependency:

```bash
pnpm dlx knip --no-progress
pnpm dlx knip --no-progress --workspace <path>   # one workspace
```

Then verify **every** finding before deleting:

- `rg -n "<symbol>"` across the repo, including tests, scripts, configs, and string references
  (dynamic imports, route registries, i18n keys).
- Framework entry points are not dead: Next.js `page`/`layout`/`route`/`middleware` files,
  Nuxt `pages`/`layouts`/`middleware`/`plugins`/`server` files and auto-imported
  `composables`/`components`/`utils`, Worker entries, Durable Object classes, config files, CLI
  scripts named in `package.json`. knip misses auto-imports, so `rg` the bare name too.
- For Dart, `dart fix --dry-run` and `flutter analyze` report unused code; generated
  `*.g.dart` / `*.freezed.dart` files follow their source.
- A type exported only for a test is not dead if the test needs it; unexport it if nothing
  outside the file does.

Delete unused files, exports, dependencies (`pnpm remove --filter <pkg> <dep>`), feature
flags, and commented-out code. Done when knip's remaining findings are each verified as used.

## 3. Apply the rules to what remains

Work through the scope against `house-rules.md`:

- [ ] Comments fail the bar → delete or move the knowledge (skill `house-comments`)
- [ ] Layer leaks: domain or application importing framework, ORM, or HTTP code
- [ ] Slice leaks: one feature importing another feature's internals
- [ ] Real duplication (third copy, or copies that must change together) → one home
- [ ] Speculative parameters, options, or abstractions with one caller → inline
- [ ] Names that need a comment to be understood → rename
- [ ] Deprecated framework APIs → current API per the project's stack doc

Do not change behaviour, public contracts, or visuals. Do not move files across slices unless
that is the task.

## 4. Verify and commit

Run the project's formatter, typecheck, and tests for each touched package, then the gate from
`AGENTS.md` → Project facts. Commit each kind of cleanup separately:

```
refactor(<scope>): remove dead code
refactor(<scope>): strip comments that fail the house bar
refactor(<scope>): <specific refactor>
```

Done when the gate passes and no cleanup commit contains a behaviour change.
