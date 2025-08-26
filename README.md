# mrashidi.me

A modern, cyberpunk-inspired personal portfolio website showcasing my work as a Software Engineer. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring an interactive terminal, real-time GitHub integration, advanced project filtering, and comprehensive blog integration.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

## 🚀 Features

### Core Features

- 🎨 **Cyberpunk Design**: Modern UI with cyberpunk aesthetics and smooth animations
- 💻 **Interactive Terminal**: Custom-built terminal with command history and real-time execution
- 📊 **GitHub Integration**: Real-time repository display and contribution graph visualization
- 🔍 **Advanced Project Filtering**: Regex search with dynamic technology categorization
- 📝 **Blog Integration**: Medium RSS feed integration with intelligent preloading and caching
- 📧 **Contact System**: AWS SES email service with reCAPTCHA protection
- 📄 **Resume Download**: Automated CV delivery with email notifications via Vercel Blob
- 🌐 **PWA Support**: Progressive Web App with offline capabilities
- 🔍 **SEO Optimized**: Meta tags, sitemap generation, and structured data
- 📱 **Responsive Design**: Optimized for all devices and screen sizes
- 🛡️ **Security Enhanced**: Comprehensive security headers, CSP, and input validation
- 📊 **Error Monitoring**: Sentry integration for error tracking and performance monitoring
- 📝 **Structured Logging**: Centralized logging system with Pino for better debugging

### Technical Features

- ⚡ **Next.js 15**: Latest framework with App Router and Turbopack
- 🎯 **TypeScript**: Full type safety throughout the application
- 🎨 **Tailwind CSS**: Utility-first styling with custom design system
- 🎭 **Framer Motion**: Smooth animations and transitions
- 🔄 **SWR**: Data fetching with caching and revalidation
- 📝 **React Hook Form**: Form handling with Zod validation
- 🔒 **Security**: reCAPTCHA, input validation, and comprehensive error handling
- 📦 **Caching**: Node-cache for blog posts and API responses with performance monitoring
- 🎨 **ShadCN UI**: Modern component library with cyberpunk theming
- 🔍 **Error Handling**: Structured error classes and safe error responses
- 🛡️ **Environment Safety**: Zod-validated environment variables with fail-fast behavior
- 🔄 **Enhanced Fetching**: Robust fetch wrapper with retry logic and caching
- 📝 **Structured Logging**: Server/client-safe logging with environment-based levels
- 🧪 **Testing Ready**: Basic test structure with smoke tests
- 🎯 **Path Aliases**: Clean imports with organized path aliases

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 3.4.17
- **Animation**: Framer Motion 12.23.12
- **UI Components**: Headless UI 2.2.7 + Radix UI 1.1.15
- **Forms**: React Hook Form 7.62.0 + Zod 4.0.17
- **Data Fetching**: SWR 2.3.6
- **Icons**: Lucide React 0.539.0 + React Icons 5.5.0
- **Fonts**: Fontsource (Albert Sans, JetBrains Mono, Orbitron, Press Start 2P, VT323)

### Backend & Services

- **Email Service**: AWS SES (@aws-sdk/client-ses 3.864.0)
- **File Storage**: Vercel Blob (@vercel/blob 1.1.1)
- **Caching**: Node-cache 5.1.2
- **XML Parsing**: xml2js 0.6.2
- **Pattern Matching**: minimatch 10.0.3
- **Utilities**: clsx 2.1.1, tailwind-merge 3.3.1
- **Error Monitoring**: Sentry (@sentry/nextjs 10.5.0)
- **Logging**: Pino 9.9.0 + Pino Pretty 13.1.1

### Development Tools

- **Package Manager**: Yarn 4.9.2
- **Linting**: ESLint 9.33.0
- **Formatting**: Prettier 3.6.2
- **Type Checking**: TypeScript 5.9.2
- **Build Tool**: Turbopack (Next.js 15)
- **Version Management**: Standard Version

### Deployment & Analytics

- **Platform**: Vercel
- **Analytics**: Vercel Analytics 1.5.0
- **Performance**: Vercel Speed Insights 1.2.0
- **PWA**: next-pwa 5.6.0
- **Error Tracking**: Sentry with automatic Vercel monitors

## 📁 Project Architecture

```
mrashidi.me/
├── public/                    # Static assets
│   ├── cv/                   # Resume files (gitignored, served via Vercel Blob)
│   ├── icons/                # Technology icons
│   └── manifest.json         # PWA manifest
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes with middleware
│   │   │   ├── blog/        # Blog API with pagination
│   │   │   ├── contact/     # Contact form API
│   │   │   ├── cv/          # CV API (download & upload via Vercel Blob)
│   │   │   ├── github/      # GitHub API integration
│   │   │   ├── health/      # Health check endpoint
│   │   │   ├── resume/      # Resume request API
│   │   │   └── version/     # Version API
│   │   ├── about/           # About page
│   │   ├── blog/            # Blog page with Medium integration
│   │   ├── contact/         # Contact page with forms
│   │   ├── projects/        # Projects page with filtering
│   │   ├── resume/          # Resume page with download
│   │   ├── loading.tsx      # Root loading component
│   │   ├── not-found.tsx    # 404 error page
│   │   ├── sitemap.ts       # Dynamic sitemap generation
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # Shared/presentational UI components
│   │   ├── layout/          # Layout components (Navbar, etc.)
│   │   ├── forms/           # Reusable form components
│   │   ├── terminal/        # Interactive terminal
│   │   │   ├── hooks/       # Terminal custom hooks
│   │   │   └── types.ts     # Terminal types
│   │   ├── ui/              # Design system atoms (Button, Card, etc.)
│   │   │   └── icons.tsx    # Centralized icon library
│   │   └── SEO/             # SEO components (Breadcrumbs, StructuredData)
│   ├── features/            # Domain modules (scale here)
│   │   ├── about/           # About page components
│   │   ├── blog/            # Blog components with SWR
│   │   ├── contact/         # Contact form components
│   │   ├── projects/        # Project filtering components
│   │   ├── resume/          # Resume components
│   │   └── index.ts         # Feature exports
│   ├── server/              # Server-only cross-cutting utilities
│   │   ├── auth/            # Authentication utilities
│   │   ├── db/              # Database client setup
│   │   ├── base.service.ts  # Base service class
│   │   ├── blog.service.ts  # Blog data service
│   │   ├── blob.service.ts  # Vercel Blob service
│   │   ├── cache.service.ts # Caching service
│   │   ├── github.service.ts # GitHub API service
│   │   ├── recaptcha.service.ts # reCAPTCHA service
│   │   └── index.ts         # Server exports
│   ├── lib/                 # Cross-cutting utilities (no React)
│   │   ├── api/             # API utilities and middleware
│   │   ├── config/          # Configuration constants
│   │   ├── email/           # Email service and templates
│   │   ├── utils/           # Organized utility functions
│   │   │   ├── string-utils.ts
│   │   │   ├── date-utils.ts
│   │   │   ├── logger.ts    # Centralized logging
│   │   │   ├── cachePerformance.ts
│   │   │   └── index.ts     # Centralized exports
│   │   ├── validation/      # Zod schemas and validators
│   │   ├── env.ts           # Zod-validated environment loader
│   │   ├── fetcher.ts       # Fetch wrapper with errors/caching
│   │   ├── logger.ts        # Tiny logger (server-safe)
│   │   ├── errors.ts        # Structured error handling
│   │   ├── animations.ts    # Animation utilities
│   │   ├── constants.ts     # Application constants
│   │   ├── structuredData.ts # SEO structured data
│   │   ├── techUtils.ts     # Technology utilities
│   │   ├── techIconMap.tsx  # Technology icon mapping
│   │   └── utils.ts         # Core utilities
│   ├── styles/              # Global styles
│   │   └── globals.css      # Global CSS with Tailwind
│   ├── config/              # Application configuration
│   │   ├── app.config.ts    # App-wide settings
│   │   ├── theme.config.ts  # Theme configuration
│   │   ├── constants.ts     # Application constants
│   │   └── index.ts         # Unified config export
│   ├── context/             # React context providers
│   ├── data/                # Static data files
│   │   ├── profile/         # Personal information
│   │   └── site/            # Site configuration
│   ├── hooks/               # Shared client hooks (browser-safe)
│   ├── types/               # Shared TypeScript types
│   ├── tests/               # Test files
│   │   └── smoke.test.ts    # Basic smoke tests
│   ├── instrumentation.ts   # Next.js instrumentation
│   └── instrumentation-client.ts # Client instrumentation
├── .vscode/                 # VSCode settings
│   └── settings.json        # Format on save, path intellisense
├── scripts/                 # Build and utility scripts
│   ├── generate-sitemap.ts  # Sitemap generation
│   ├── generate-og-images.js # Open Graph image generation
│   └── generate-placeholder-og.js # Placeholder OG images
├── .env.example             # Environment variables documentation
├── next.config.mjs          # Next.js configuration with security headers
├── tsconfig.json            # TypeScript configuration with path aliases
├── tailwind.config.ts       # Tailwind CSS configuration
├── components.json          # ShadCN UI configuration
├── eslint.config.mjs        # ESLint configuration
├── postcss.config.js        # PostCSS configuration
├── sentry.edge.config.ts    # Sentry edge configuration
├── sentry.server.config.ts  # Sentry server configuration
└── package.json             # Dependencies and scripts
```

## 🏗 Architecture Highlights

### **Feature-Based Architecture**

Features are organized as domain modules with co-located components, server actions, and utilities:

```typescript
import { BlogHeader, BlogGrid, BlogPagination } from "@/features/blog";
import { ContactFormSection, MentorshipSection } from "@/features/contact";
import { ProjectCard, ProjectFilters } from "@/features/projects";
```

### **Path Aliases & Developer Experience**

Enhanced path aliases and development tools for better productivity:

```typescript
// Clean imports with path aliases
import { Button } from "@components/ui/Button";
import { BlogHeader } from "@features/blog";
import { env } from "@lib/env";
import { BlogService } from "@server/blog.service";

// VSCode settings provide format-on-save and better intellisense
```

### **Enhanced Core Utilities**

New utilities provide better type safety, error handling, and developer experience:

```typescript
import { env } from "@/lib/env"; // Zod-validated environment variables
import { fetcher, fetcherGet, fetcherPost } from "@/lib/fetcher"; // Robust fetch wrapper
import { logger } from "@/lib/logger"; // Server/client-safe logging
import { formatDate, truncateText, isValidEmail } from "@/lib/utils";
```

### **Type-Safe API Layer**

Comprehensive API layer with middleware, validation, and error handling:

```typescript
export const GET = withPagination(handleBlogPosts);
export const POST = withValidation(handleContactForm, validateContactFormAPI);
```

### **Custom Hooks for Business Logic**

Reusable hooks that separate business logic from UI components:

```typescript
const { posts, isLoading, error, setPage } = useBlogData(6);
const { filters, setSearchQuery, toggleStack } = useProjectFilters();
```

### **Validation with Zod Schemas**

Type-safe form validation using reusable base schemas:

```typescript
const baseNameSchema = z.string().min(1, "Name is required").max(50);
const baseEmailSchema = z.email("Please enter a valid email address");

export const contactFormSchema = z.object({
  name: baseNameSchema,
  email: baseEmailSchema,
  subject: baseSubjectSchema,
  message: baseMessageSchema,
});
```

### **Structured Error Handling**

Comprehensive error handling with custom error classes and safe responses:

```typescript
import { AppError, ValidationError, APIError } from "@/lib/errors";

try {
} catch (error) {
  throw new APIError("Failed to fetch data", { cause: error });
}
```

### **Server-Side Architecture**

Server-only utilities and services are properly isolated:

```typescript
import { BlogService } from "@/server/blog.service";
import { GitHubService } from "@/server/github.service";
import { BlobService } from "@/server/blob.service";

// Server actions and database operations
import { createSession, getUserByEmail } from "@/server/auth";
```

## 🎯 Key Architectural Principles

### **Feature-First Organization**

- Features are domain modules with co-located components, server actions, and utilities
- Clear separation between shared UI components and feature-specific logic
- Server-only code properly isolated in `src/server/`

### **Type Safety & Error Handling**

- Zod-validated environment variables with fail-fast behavior
- Enhanced fetch wrapper with retry logic and caching
- Structured error handling with custom error classes
- Server/client-safe logging with environment-based levels

### **Developer Experience**

- Path aliases for clean imports (`@features/*`, `@server/*`, etc.)
- VSCode settings for format-on-save and better intellisense
- Environment documentation with `.env.example`
- Basic smoke tests for project structure validation

### **YAGNI (You Aren't Gonna Need It)**

- Removed unused interfaces and methods
- Simplified validation logic
- Eliminated unnecessary abstractions

### **KISS (Keep It Simple, Stupid)**

- Direct Zod validation without wrapper functions
- Simplified service classes
- Streamlined utility functions

### **DRY (Don't Repeat Yourself)**

- Centralized utility functions
- Reusable base validation schemas
- Unified configuration management
- Single source of truth for exports

## 🔧 Development Setup

### Prerequisites

- Node.js 18 or higher
- Yarn package manager
- GitHub Personal Access Token
- AWS SES credentials (for email functionality)
- Google reCAPTCHA keys
- Sentry DSN (for error monitoring)

### Environment Variables

Create a `.env.local` file with the following variables (see `.env.example` for complete documentation):

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mrashidi.me
NEXT_PUBLIC_GITHUB_USERNAME=mrashidi

# GitHub API
GITHUB_TOKEN=your_github_token_here

# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org_here
SENTRY_PROJECT=your_sentry_project_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here

# reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Email Service Configuration
EMAIL_SERVICE_API_KEY=your_email_service_api_key_here
EMAIL_SERVICE_DOMAIN=your_email_service_domain_here
EMAIL_FROM=your_from_email_here
EMAIL_TO=your_to_email_here
```

### Installation & Running

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mrdevx/mrashidi.me.git
   cd mrashidi.me
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start development server:**

   ```bash
   yarn dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build production version with sitemap generation
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn generate-sitemap` - Generate sitemap manually
- `yarn check-og-images` - Check Open Graph images
- `yarn generate-og-images` - Generate placeholder OG images
- `yarn release` - Create a new release with standard-version

## 🔒 Security Features

- **Input Validation**: Zod schemas for all user inputs
- **reCAPTCHA Integration**: Bot protection on forms
- **CORS Configuration**: Proper cross-origin settings
- **Rate Limiting**: API endpoint protection
- **Error Handling**: Secure error messages
- **Environment Variables**: Sensitive data protection
- **Security Headers**: Comprehensive CSP and security headers
- **Frame Protection**: X-Frame-Options and frame-ancestors directives
- **Content Type Protection**: X-Content-Type-Options headers
- **XSS Protection**: X-XSS-Protection headers
- **HSTS**: Strict-Transport-Security headers

## 🚀 Deployment

The application is deployed on Vercel with the following optimizations:

- **Edge Functions**: API routes deployed as edge functions
- **CDN**: Global content delivery network
- **Automatic Scaling**: Serverless scaling based on demand
- **Analytics**: Built-in performance monitoring
- **PWA**: Progressive Web App capabilities
- **Error Monitoring**: Sentry integration with automatic Vercel monitors
- **Security**: Comprehensive security headers and CSP

## 📄 License

Copyright (c) 2025 Mahdi Rashidi. All rights reserved.

This source code is provided for educational and demonstration purposes only. You may:

- View and study the code
- Fork the repository for reference
- Suggest improvements via issues or pull requests

You may not:

- Use this code for commercial purposes
- Redistribute the code
- Use the code to create similar websites
- Use any of the design elements, themes, or content without explicit permission

## 📞 Contact

**Mahdi Rashidi**

- **GitHub**: [@mrdevx](https://github.com/mrdevx)
- **Email**: contact@mrashidi.me
- **Location**: Berlin, Germany
- **Website**: [mrashidi.me](https://mrashidi.me)

---

_Built with ❤️ using Next.js, TypeScript, and Tailwind CSS_
