---
id: 0002
title: Organise code by feature slice under src/features
issues: []
status: accepted
date: 2026-10-13
supersedes: []
superseded_by: []
related: [DR-0001]
areas: [app, api, ask-mr]
---

# DR-0002: Organise code by feature slice under src/features

> Everything one feature needs lives in `src/features/<feature>/`. Route files in `src/app/` stay
> thin and compose a feature. A slice with real domain logic splits into `domain/`,
> `application/`, `infrastructure/`, `ui/`, as `projects/` does; a UI-only slice stays flat.
> Slices import each other only through their `index.ts`. Code moves to `src/components/` or
> `src/lib/` only when a second feature needs it.

## Context

The site already grew feature-first: `about`, `ask-mr`, `blog`, `contact`, `home`, `projects`,
and `resume` each have a folder with an `index.ts`. Their insides differ. `projects/` has
DDD layers, `ask-mr/` splits by runtime (`client/`, `server/`, `knowledge/`, `ui/`), and the
others are flat lists of components. Shared code is spread over `src/components/`, `src/lib/`,
`src/hooks/`, `src/context/`, `src/config/`, and `src/data/`, and some of it has one consumer.
House rules §1 (HR-0003) asks for vertical slices with tactical DDD inside; this record says
what that means for a single Next.js app.

## Decision

- New features start in `src/features/<feature>/`, exporting their public surface from `index.ts`.
- A slice adds layers only when it has domain logic worth isolating: `domain/` (plain
  TypeScript, no React or Next imports), `application/`, `infrastructure/`, `ui/`. Ask MR keeps
  its runtime split, because the server and client halves must not import each other.
- `src/app/**` route and page files parse input, call the feature, and render. API routes
  validate with Zod at the boundary.
- `src/components/`, `src/lib/`, and `src/hooks/` hold code with two or more real consumers.
- An existing slice is not restructured inside a feature PR. Moving a slice into the layered
  shape, or a single-consumer shared file into its slice, is its own PR.

## Consequences

- **Gains:** a feature can be read, tested, and deleted as one folder; layers only where they pay.
- **Costs:** two slice shapes to recognise, and older shared folders hold single-consumer code
  until someone moves it.
- **Accepted risks:** flat slices that grow logic without growing layers. Review catches it.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Layer-first folders (`components/`, `hooks/`, `services/` at the top) | One feature spreads over five folders; the site has already moved away from it |
| DDD layers in every slice | Most slices are presentational; empty layers add ceremony and nothing else |

## Implementation

- [x] Slice layout in Project facts — `AGENTS.md`
- [ ] Move single-consumer files out of `src/hooks/` and `src/context/`, one PR per slice

## Revisit when

- A second app or package joins the repo.
- Server and client code in a flat slice start importing each other.
