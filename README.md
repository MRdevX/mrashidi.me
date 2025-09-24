# mrashidi.me

A modern personal portfolio showcasing my work as a Software Engineer. Built with Next.js 15, TypeScript, and Tailwind CSS.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

## 🚀 Features

- **Interactive Terminal**: Custom-built terminal with command history and real-time execution
- **GitHub Integration**: Real-time repository display and contribution graph
- **Project Filtering**: Regex search with dynamic technology categorization
- **Blog Integration**: Medium RSS feed with intelligent preloading
- **Email System**: AWS SES with React Email templates and reCAPTCHA protection
- **Resume Download**: Automated CV delivery via Vercel Blob
- **PWA Support**: Progressive Web App with offline capabilities
- **SEO Optimized**: Meta tags, sitemap generation, and structured data

## 🛠 Tech Stack

**Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, SWR, React Email

**Backend**: AWS SES, Vercel Blob, Node-cache, Sentry, Pino

**Tools**: pnpm, Biome, Turbopack

## 🏗 Architecture

Feature-based organization with domain modules, full TypeScript, and server-side isolation.

```
src/
├── app/                    # Next.js App Router
├── components/            # Shared UI components
├── features/              # Domain modules
├── lib/services/          # Email service with React Email
├── data/                  # Static data
└── hooks/                 # Custom React hooks
```

## 🔧 Quick Start

```bash
git clone https://github.com/mrdevx/mrashidi.me.git
cd mrashidi.me
pnpm install
cp .env.example .env.local
pnpm dev
```

**Scripts**: `dev`, `build`, `check:fix`, `generate-sitemap`

## 📧 Email System

Modern email templates built with React Email:

- **Component-based templates** with responsive design
- **AWS SES integration** for reliable delivery
- **Friendly, casual tone** for better engagement
- **Server-side rendering** of React components to HTML/text

```typescript
export function ContactUserTemplate({ data, templateConfig }) {
  return (
    <BaseEmailTemplate title="Message Received" templateConfig={templateConfig}>
      <Text style={greetingStyle}>Hey {data.name}! 👋</Text>
      <CallToActionButton href={templateConfig.companyWebsite}>
        Check Out My Work
      </CallToActionButton>
    </BaseEmailTemplate>
  );
}
```

## 🔒 Security & Quality

- **Input validation** with Zod schemas
- **reCAPTCHA integration** and rate limiting
- **Pre-commit hooks** with Biome linting and formatting
- **TypeScript strict mode** with comprehensive type checking

## 🚀 Deployment

Deployed on Vercel with Edge Functions, global CDN, and PWA capabilities.

## 📞 Contact

- **GitHub**: [@mrdevx](https://github.com/mrdevx)
- **Email**: contact@mrashidi.me
- **Website**: [mrashidi.me](https://mrashidi.me)

---

_Built with ❤️ using Next.js, TypeScript, and Tailwind CSS_
