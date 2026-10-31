---
id: 0013
title: Add WebGL effects with three and React Three Fiber as progressive enhancement
issues: []
status: accepted
date: 2026-10-31
supersedes: []
superseded_by: []
related: ["DR-0002", "DR-0009"]
areas: [app]
---

# DR-0013: Add WebGL effects with three and React Three Fiber as progressive enhancement

> The site renders two WebGL scenes with `three` and `@react-three/fiber`:
> - a 3D skyline of GitHub contributions
> - a glyph field behind the pages
>
> They run only on capable desktops, load after the page is idle, and pause when off-screen.
> Every other device keeps the 2D graph and the 2D glyph rain. No text, link, or Largest
> Contentful Paint element depends on WebGL.

## Context

The site's look is a dark terminal with one orange, and its only motion was 2D: a canvas glyph
rain and a flat SVG contribution calendar. We wanted depth without:
- slowing the first paint
- spending battery on phones
- hiding content from people who use reduced motion or assistive technology

The CSP has no `worker-src` and no `blob:` in `connect-src`. Any library that spawns blob
workers, such as troika text in drei, would fail.

## Decision

- **Libraries:** `three` and `@react-three/fiber` v9, which supports React 19. No drei. Scenes
  use `InstancedMesh`, `Points` and a `CanvasTexture`, which need no workers or extra loaders.
- **Shared code** lives in `apps/web/src/lib/three/`, because two slices use it:
  - `shouldRender3D` and `useRender3D` gate rendering on all of these: WebGL2, not a low-end
    device, `(pointer: fine)`, a viewport at least 1024px wide, and no
    `prefers-reduced-motion: reduce`.
  - `useInView` pauses the render loop when a canvas is off-screen or the tab is hidden.
  - `LazyCanvas` caps the device pixel ratio at 1.5.
- **Loading:** scenes load through `next/dynamic({ ssr: false })` once `useRender3D()` is true,
  so `three` never ships in the initial JavaScript.
- **The skyline** sits in the GitHub Activity section with a 2D/3D toggle. The 2D SVG graph
  stays as the accessible version and as the fallback. Bar colour follows the API's
  contribution `level` ([DR-0009](0009-api-owns-content-derivations.md)).
- **The glyph field** replaces the 2D rain only where `useRender3D()` is true. Elsewhere,
  `BackgroundEffects` keeps the 2D canvas, or static gradients under reduced motion.

## Consequences

- **Gains:**
  - The home page and background gain depth on desktops.
  - The contribution history becomes a distinctive piece built from real data.
  - The gate and the in-view pause keep the cost off phones and off-screen canvases.
- **Costs:**
  - About 245 KB gzipped of async JavaScript (one chunk) on capable desktops.
  - Two rendering paths, 2D and 3D, to keep in step.
  - Both scenes need visual checks; unit tests cover only their pure layout and gating code.
- **Accepted risks:** some GPUs pass the WebGL2 check but render slowly. The DPR cap, instancing
  and `powerPreference: "low-power"` limit that, and the user can switch back to 2D.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| Plain `three` without React Three Fiber | Manual scene lifecycle and resize handling in React effects, with more code to get wrong |
| drei helpers (`<Text>`, `<OrbitControls>`) | Text spawns blob workers the CSP blocks; the scenes need no camera controls |
| A 3D hero behind the name | Puts WebGL on the LCP path and competes with the name |
| Spline or a pre-rendered video | Adds an external runtime or heavy media, and can't render live contribution data |

## Implementation

- `apps/web/src/lib/three/`, `apps/web/src/lib/utils/performance.ts`
- `apps/web/src/features/home/skyline/`, `apps/web/src/features/home/HomeContributionSection.tsx`
- `apps/web/src/components/ui/background/`, `apps/web/src/components/ui/BackgroundEffects.tsx`

## Revisit when

- WebGPU is broadly available and the scenes need more than WebGL2 gives.
- Field data shows the scenes hurting Interaction to Next Paint or battery on desktops.
- A third scene appears and wants shared post-processing or helpers.
