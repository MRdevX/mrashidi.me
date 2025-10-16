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
- `og-image.png` - Homepage
- `og-about.png` - About page
- `og-projects.png` - Projects page
- `og-contact.png` - Contact page
- `og-blog.png` - Blog page
- `og-resume.png` - Resume page
- `twitter-image.png` - Twitter card

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
    images: ['/og-image.png'],
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

To modify the design, edit the shared template:
- **Shared Template**: `src/components/og-template.tsx` (for Next.js/API routes)
- **Script Template**: `scripts/og-template.jsx` (for Node.js scripts)

Both templates use the same React-based styling approach with your brand colors. The shared template ensures consistency between static and dynamic generation.

### Template Structure

The `OgImageTemplate` component accepts three props:
- `title` (string): Main title text
- `subtitle` (string): Subtitle text  
- `description` (string): Description text

### Making Changes

1. **Update the shared template** in `src/components/og-template.tsx`
2. **Sync changes** to `scripts/og-template.jsx` (Node.js version)
3. **Test both** static generation and API route
