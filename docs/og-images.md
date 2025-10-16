# OG Image Generation

This project uses `@vercel/og` for generating Open Graph images, which is much more efficient than the previous canvas-based approach.

## Features

- **Lightweight**: Uses `@vercel/og` instead of heavy `canvas` dependency
- **Modern Design**: Brand-consistent styling with your colors (#ff5f1f)
- **Dynamic Generation**: API route for on-demand image generation
- **Static Fallbacks**: Pre-generated images for common pages

## Usage

### Static Images

Generate static OG images for common pages:

```bash
pnpm generate-og-images
```

This creates images in `/public/`:
- `og-image.jpg` - Homepage
- `og-about.jpg` - About page
- `og-projects.jpg` - Projects page
- `og-contact.jpg` - Contact page
- `og-blog.jpg` - Blog page
- `og-resume.jpg` - Resume page
- `twitter-image.jpg` - Twitter card

### Dynamic Images

Use the API route for dynamic content:

```
/api/og?title=Custom Title&subtitle=Subtitle&description=Description text
```

**Example URLs:**
- `/api/og?title=My Blog Post&subtitle=Software Engineering&description=Learn about modern web development`
- `/api/og?title=Project Name&subtitle=Open Source&description=A description of the project`

### Integration

In your metadata, you can use either:

```typescript

export const metadata = {
  openGraph: {
    images: ['/og-image.jpg'],
  },
};


export const metadata = {
  openGraph: {
    images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`],
  },
};
```

## Benefits

1. **Build Performance**: Removed heavy `canvas` dependency
2. **Bundle Size**: Smaller production bundle
3. **Flexibility**: Both static and dynamic generation
4. **Vercel Optimized**: Uses Vercel's edge runtime for fast generation
5. **Brand Consistent**: Matches your site's design system

## Customization

To modify the design, edit:
- Static generation: `scripts/generate-placeholder-og.jsx`
- Dynamic generation: `src/app/api/og/route.tsx`

Both use the same React-based styling approach with your brand colors.
