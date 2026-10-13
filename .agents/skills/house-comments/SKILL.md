---
name: house-comments
description: >-
  The house comment bar: code carries no comment unless it says something the code
  cannot. Use when writing or reviewing code, and when adding, stripping, or judging
  comments and doc blocks.
---

# House comments

**Default: write none.** A comment claims the code alone is not enough. Usually that claim is
false. This covers `//`, `/* */`, JSDoc, `///`, `#`, and SQL comments alike.

## The bar

Keep a comment only if a competent engineer could not recover the information from the code,
and getting it wrong costs real time or breaks something. That is one of:

- **An outside constraint**: platform limit, vendor behaviour, wire format, spec quirk.
- **A rejected obvious approach**, when the code looks like it should be simpler.
- **Deliberate ordering or timing** that reads like an accident.
- **An intentionally empty, null, or disabled value**, so nobody "fixes" it.

## Two tests before writing one

1. **Delete it.** Is anything lost? If not, that is the answer.
2. **Fix the code instead.** Most comments are a missing rename, extracted function, or named
   constant. The code change cannot go stale.

## Keep

```ts
// WebSocket upgrades bypass Hono: the global middleware chain mutates
// response headers, which throws on an immutable 101 response.
```

```ts
// D1 caps bound parameters at 100 per statement; batch inserts stay below it.
```

Each records a constraint that lives outside the file.

## Delete

```ts
/** GET /api/me/settings: current user's preferences. */   // the route says this
/** Room state. */                                          // says nothing
// Shuffle the players                                      // narrates the next line
// ---- helpers ----                                        // banner; split the file instead
// const old = legacy(x)                                    // commented-out code; git has it
// added in v0.9, used to be X                              // changelog; git log has it
// TODO: handle errors                                      // unowned TODO
```

## Not comments, keep them

- Tool directives: `biome-ignore`, `@ts-expect-error`, `eslint-disable`, `/// <reference>`.
- API contract text: OpenAPI descriptions, Zod `.describe()`, `describeRoute()`.
- License headers required by a dependency's license.
- `TODO(#123)` with an issue reference.

## Where the knowledge goes instead

| Knowledge | Home |
| --------- | ---- |
| Why a cross-cutting choice was made | `docs/decisions/` |
| How a subsystem works today | `docs/` guides |
| What a function guarantees | its test name |
| What an endpoint accepts | the schema and OpenAPI spec |

## Stripping comments from existing code

1. Work one package at a time. Apply the bar to every comment; a comment beside code you touch
   that is now wrong is fixed or removed.
2. If a removed comment carried real knowledge, move it (table above) or rename the code.
3. Run the formatter, typecheck, and tests for the package. Comment removal often leaves blank
   line or formatting fallout.
4. Commit separately: `refactor(<scope>): strip comments that fail the house bar`.

Done when every remaining comment fits one of the four bar categories or the "not comments"
list.
