# OG images

Open Graph images are rendered with `@vercel/og` from one template,
`apps/web/src/components/og-template.tsx` (`OgImageTemplate`, props `title`, `subtitle`,
`description`). Two consumers use it, so a design change happens in that file only.

## Static images

```bash
pnpm --filter @mrashidi/web generate-og-images
```

`apps/web/scripts/generate-og-images.jsx` writes 1200×630 PNGs to `apps/web/public/`:
`og-image.png` (home), `og-about.png`, `og-projects.png`, `og-contact.png`, `og-blog.png`,
`og-resume.png`, and `twitter-image.png`. `pnpm build` runs it through `generate-assets`;
`pnpm build:fast` skips it.

## Dynamic images

`GET /api/og?title=…&subtitle=…&description=…` (`apps/web/src/app/api/og/route.tsx`, edge
runtime) renders the same template on demand. Missing parameters fall back to the site
defaults; `title`, `subtitle`, and `description` are cut to 100, 150, and 250 characters.

Page metadata points at a static image (`/og-about.png`) or at the route with encoded
parameters.
