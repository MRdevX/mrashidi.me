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
- 📄 **Resume Download**: Automated CV delivery with email notifications
- 🌐 **PWA Support**: Progressive Web App with offline capabilities
- 🔍 **SEO Optimized**: Meta tags, sitemap generation, and structured data
- 📱 **Responsive Design**: Optimized for all devices and screen sizes

### Technical Features

- ⚡ **Next.js 15**: Latest framework with App Router and Turbopack
- 🎯 **TypeScript**: Full type safety throughout the application
- 🎨 **Tailwind CSS**: Utility-first styling with custom design system
- 🎭 **Framer Motion**: Smooth animations and transitions
- 🔄 **SWR**: Data fetching with caching and revalidation
- 📝 **React Hook Form**: Form handling with Zod validation
- 🔒 **Security**: reCAPTCHA, input validation, and error handling
- 📦 **Caching**: Node-cache for blog posts and API responses with performance monitoring

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **Animation**: Framer Motion 12.23.0
- **UI Components**: Headless UI 2.2.4
- **Forms**: React Hook Form 7.62.0 + Zod 4.0.17
- **Data Fetching**: SWR 2.3.4
- **Icons**: Lucide React 0.263.1 + React Icons 5.5.0

### Backend & Services

- **Email Service**: AWS SES (@aws-sdk/client-ses 3.840.0)
- **Caching**: Node-cache 5.1.2
- **XML Parsing**: xml2js 0.6.2
- **Pattern Matching**: minimatch 10.0.3
- **Utilities**: clsx 2.1.1, tailwind-merge 3.3.1

### Development Tools

- **Package Manager**: Yarn 4.9.2
- **Linting**: ESLint 9.30.1
- **Formatting**: Prettier 3.6.2
- **Type Checking**: TypeScript 5.7.2
- **Build Tool**: Turbopack (Next.js 15)

### Deployment & Analytics

- **Platform**: Vercel
- **Analytics**: Vercel Analytics 1.5.0
- **Performance**: Vercel Speed Insights 1.2.0
- **PWA**: next-pwa 5.6.0

## 📁 Project Architecture

```
mrashidi.me/
├── public/                    # Static assets
│   ├── cv/                   # Resume files
│   ├── icons/                # Technology icons
│   └── manifest.json         # PWA manifest
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes with middleware
│   │   │   ├── blog/        # Blog API with pagination
│   │   │   ├── contact/     # Contact form API
│   │   │   └── resume/      # Resume request API
│   │   ├── about/           # About page
│   │   ├── blog/            # Blog page with Medium integration
│   │   ├── contact/         # Contact page with forms
│   │   ├── projects/        # Projects page with filtering
│   │   ├── resume/          # Resume page with download
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── features/        # Feature-based organization
│   │   │   ├── about/       # About page components
│   │   │   ├── blog/        # Blog components with SWR
│   │   │   ├── contact/     # Contact form components
│   │   │   ├── projects/    # Project filtering components
│   │   │   └── resume/      # Resume components
│   │   ├── layout/          # Layout components (Navbar, etc.)
│   │   ├── forms/           # Reusable form components
│   │   ├── terminal/        # Interactive terminal
│   │   │   ├── hooks/       # Terminal custom hooks
│   │   │   └── types.ts     # Terminal types
│   │   └── ui/              # Reusable UI components
│   │       └── icons.tsx    # Centralized icon library
│   ├── config/              # Application configuration
│   │   ├── app.config.ts    # App-wide settings
│   │   ├── theme.config.ts  # Theme configuration
│   │   ├── constants.ts     # Application constants
│   │   └── index.ts         # Unified config export
│   ├── context/             # React context providers
│   ├── data/                # Static data files
│   │   ├── profile/         # Personal information
│   │   └── site/            # Site configuration
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configuration
│   │   ├── api/             # API utilities and middleware
│   │   ├── config/          # Configuration constants
│   │   ├── email/           # Email service and templates
│   │   ├── utils/           # Organized utility functions
│   │   │   ├── string.utils.ts
│   │   │   ├── date.utils.ts
│   │   │   └── index.ts     # Centralized exports
│   │   ├── validation/      # Zod schemas and validators
│   │   └── utils.ts         # Core utilities
│   ├── services/            # External service integrations
│   └── types/               # TypeScript type definitions
├── scripts/                 # Build and utility scripts
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🏗 Architecture Highlights

### **Feature-Based Component Organization**

Components are organized by feature rather than type, making the codebase more maintainable and scalable:

```typescript
import { BlogHeader, BlogGrid, BlogPagination } from "@/components/features/blog";
import { ContactFormSection, MentorshipSection } from "@/components/features/contact";
import { ProjectCard, ProjectFilters } from "@/components/features/projects";
```

### **Centralized Configuration Management**

All application settings are centralized in the `src/config` directory:

```typescript
import { CONFIG } from "@/config";

const apiTimeout = CONFIG.constants.api.TIMEOUT;
const themeColors = CONFIG.theme.colors;
```

### **Organized Utility Functions**

Utilities are categorized by domain and centralized for better maintainability:

```typescript
import { formatDate, truncateText, isValidEmail } from "@/lib/utils";

import { formatDate, formatRelativeTime } from "@/lib/utils/date.utils";
import { toTitleCase, generateRandomString } from "@/lib/utils/string.utils";
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

## 🎯 Key Architectural Principles

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

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# GitHub Integration
GITHUB_TOKEN=your_github_token

# AWS SES Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
EMAIL_FROM_ADDRESS=no-reply@mrashidi.me
EMAIL_TO_ADDRESS=contact@mrashidi.me

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
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

## 🔒 Security Features

- **Input Validation**: Zod schemas for all user inputs
- **reCAPTCHA Integration**: Bot protection on forms
- **CORS Configuration**: Proper cross-origin settings
- **Rate Limiting**: API endpoint protection
- **Error Handling**: Secure error messages
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

The application is deployed on Vercel with the following optimizations:

- **Edge Functions**: API routes deployed as edge functions
- **CDN**: Global content delivery network
- **Automatic Scaling**: Serverless scaling based on demand
- **Analytics**: Built-in performance monitoring
- **PWA**: Progressive Web App capabilities

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
