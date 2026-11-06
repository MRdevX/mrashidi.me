# OG images

Open Graph images are rendered with `@vercel/og` from one template,
`apps/web/src/components/og-template.tsx` (`OgImageTemplate`, props `title`, `subtitle`,
`description`). `apps/web/scripts/generate-og-images.jsx` is its only consumer; there is no
runtime image route, so nobody can render the template with text of their choosing.

## Static images

```bash
pnpm --filter @mrashidi/web generate-og-images
```

`apps/web/scripts/generate-og-images.jsx` writes 1200×630 PNGs to `apps/web/public/`:
`og-image.png` (home), `og-about.png`, `og-projects.png`, `og-contact.png`, `og-blog.png`,
`og-resume.png`, and `twitter-image.png`. `pnpm build` runs it through `generate-assets`;
`pnpm build:fast` skips it.

Page metadata points at one of these static images (`/og-about.png`).
