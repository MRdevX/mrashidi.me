# mrashidi.me

A modern, cyberpunk-inspired personal portfolio showcasing my work as a Software Engineer. Built with Next.js 15, TypeScript, and Tailwind CSS, featuring an interactive terminal, real-time GitHub integration, and comprehensive project filtering.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

## 🎯 Purpose

This portfolio showcases my work as a Software Engineer, focusing on:

- **Backend Development**: Node.js, TypeScript, NestJS, Express
- **Cloud Platforms**: Azure, AWS, Kubernetes, Docker
- **Databases**: PostgreSQL, MongoDB, Redis, TypeORM
- **Architecture**: Microservices, Event-Driven Architecture, API Design
- **DevOps**: GitLab CI/CD, Terraform, Linux, Infrastructure Management

## 🚀 Key Features

- **Interactive Terminal**: Custom-built terminal with command history and real-time execution
- **GitHub Integration**: Real-time repository display and contribution graph
- **Advanced Project Filtering**: Regex search with dynamic technology categorization
- **Blog Integration**: Medium RSS feed with intelligent preloading
- **Contact System**: AWS SES email service with reCAPTCHA protection
- **Resume Download**: Automated CV delivery via Vercel Blob
- **PWA Support**: Progressive Web App with offline capabilities
- **SEO Optimized**: Meta tags, sitemap generation, and structured data

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Components**: Headless UI + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: SWR
- **Icons**: Lucide React + React Icons

### Backend & Services

- **Email Service**: AWS SES
- **File Storage**: Vercel Blob
- **Caching**: Node-cache
- **Error Monitoring**: Sentry
- **Logging**: Pino
- **XML Parsing**: xml2js

### Development Tools

- **Package Manager**: pnpm
- **Linting & Formatting**: Biome (replaced ESLint + Prettier)
- **Build Tool**: Turbopack

## 🏗 Architecture

### Feature-Based Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes with middleware
│   ├── about/             # About page
│   ├── blog/              # Blog with Medium integration
│   ├── contact/           # Contact form
│   ├── projects/          # Projects with filtering
│   └── resume/            # Resume download
├── components/            # Shared UI components
│   ├── layout/            # Navigation, branding
│   ├── terminal/          # Interactive terminal
│   ├── ui/                # Design system
│   └── forms/             # Form components
├── features/              # Domain modules
│   ├── about/             # About page components
│   ├── blog/              # Blog components
│   ├── contact/           # Contact components
│   ├── projects/          # Project filtering
│   └── resume/            # Resume components
├── server/                # Server-only utilities
│   ├── auth/              # Authentication
│   ├── blog.service.ts    # Blog data service
│   ├── github.service.ts  # GitHub API service
│   └── blob.service.ts    # Vercel Blob service
├── lib/                   # Cross-cutting utilities
│   ├── api/               # API utilities
│   ├── email/             # Email service
│   ├── validation/        # Zod schemas
│   └── utils/             # Utility functions
├── data/                  # Static data
│   ├── profile/           # Personal information
│   └── site/              # Site configuration
└── hooks/                 # Custom React hooks
```

### Key Architectural Principles

- **Feature-First**: Domain modules with co-located components and logic
- **Type Safety**: Full TypeScript with Zod validation
- **Server Isolation**: Server-only code properly isolated
- **Error Handling**: Structured error classes and safe responses
- **Performance**: SWR caching, lazy loading, and optimization
- **Code Quality**: Biome for linting and formatting with zero-config setup

## 🔧 Development Setup

### Prerequisites

- Node.js 22+
- pnpm package manager
- GitHub Personal Access Token
- AWS SES credentials
- Google reCAPTCHA keys

### Quick Start

```bash
# Clone and install
git clone https://github.com/mrdevx/mrashidi.me.git
cd mrashidi.me
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linting and formatting
- `pnpm lint:fix` - Fix linting issues automatically
- `pnpm format` - Format code with Biome
- `pnpm generate-sitemap` - Generate sitemap

## 🔒 Security Features

- Input validation with Zod schemas
- reCAPTCHA integration
- Comprehensive security headers
- CORS configuration
- Rate limiting
- Secure error handling

## 🛠 Development Workflow

This project uses modern development tools to ensure code quality and consistency:

### Pre-commit Hooks (Husky + lint-staged)

- **Automatic Linting**: Biome checks and fixes code issues
- **Code Formatting**: Consistent formatting across all files
- **Type Checking**: TypeScript validation before commits
- **Staged Files Only**: Only processes files you're committing

#### Setup

```bash
# Install dependencies (already done)
pnpm install

# Husky is automatically initialized with the prepare script
pnpm run prepare
```

#### What happens on commit:

1. **JavaScript/TypeScript files** (`*.{js,jsx,ts,tsx}`):
   - Biome check and fix issues
   - Biome format for consistent styling
2. **Configuration files** (`*.{json,md,yml,yaml}`):
   - Biome format for consistent formatting
3. **CSS files** (`*.{css,scss}`):
   - Biome check for CSS issues

#### What happens on push:

- Full codebase check with `biome check`
- Ensures no issues slip through

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server with Turbopack
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm check              # Check code with Biome
pnpm check:fix          # Check and fix code issues
pnpm lint               # Lint code only
pnpm lint:fix           # Lint and fix issues
pnpm format             # Format code only
pnpm format:fix         # Format and fix issues

# Testing
pnpm test               # Run tests in watch mode
pnpm test:run           # Run tests once
pnpm test:coverage      # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests

# Utilities
pnpm generate-sitemap   # Generate sitemap.xml
pnpm clean              # Clean node_modules and build files
pnpm reinstall          # Clean and reinstall dependencies
```

### Code Quality Standards

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Biome**: Fast linter and formatter with sensible defaults
- **Pre-commit**: Automatic code quality checks before commits
- **Pre-push**: Full codebase validation before pushing
- **Consistent Formatting**: 2-space indentation, double quotes, semicolons

## 🚀 Deployment

Deployed on Vercel with:

- Edge Functions for API routes
- Global CDN
- Automatic scaling
- Built-in analytics
- PWA capabilities
- Sentry error monitoring

## 📄 License

Copyright (c) 2025 Dee Rashidi. All rights reserved.

This source code is provided for educational and demonstration purposes only.

## 📞 Contact

- **GitHub**: [@mrdevx](https://github.com/mrdevx)
- **Email**: contact@mrashidi.me
- **Website**: [mrashidi.me](https://mrashidi.me)

---

_Built with ❤️ using Next.js, TypeScript, and Tailwind CSS_
