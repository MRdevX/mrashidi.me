# mrashidi.me

A modern, cyberpunk-inspired personal portfolio website showcasing my work as a Backend Engineer. As a software engineer with a strong backend focus, this is my hobby project born from curiosity about frontend development and Next.js. I wanted to build my own interactive website to showcase my projects and skills while exploring modern web development practices. The site features an interactive terminal, real-time GitHub integration, advanced project filtering, and comprehensive blog integration.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

> **Contributions Welcome**: As a backend engineer exploring frontend development, I welcome contributions from frontend engineers! I'm open to new ideas, improvements, and suggestions to make this project better. Feel free to open issues or submit pull requests.

## 🚀 Features

### Core Features

- 🎨 **Cyberpunk Design**: Modern UI with cyberpunk aesthetics and smooth animations
- 💻 **Interactive Terminal**: Custom-built terminal with command history and real-time execution
- 📊 **GitHub Integration**: Real-time repository display and contribution graph visualization
- 🔍 **Advanced Project Filtering**: Regex search with dynamic technology categorization
- 📝 **Blog Integration**: Medium RSS feed integration with caching and pagination
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
- 🎨 **Headless UI**: Accessible UI components
- 🔒 **Security**: reCAPTCHA, input validation, and error handling
- 📦 **Caching**: Node-cache for blog posts and API responses
- 🚀 **Performance**: Optimized images, lazy loading, and code splitting

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **Animation**: Framer Motion 12.23.0
- **UI Components**: Headless UI 2.2.4
- **Forms**: React Hook Form 7.62.0 + Zod 4.0.17
- **Data Fetching**: SWR 2.3.4
- **Icons**: React Icons 5.5.0

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

## 📁 Project Structure

```
mrashidi.me/
├── public/                    # Static assets
│   ├── cv/                   # Resume files
│   ├── icons/                # Technology icons
│   └── manifest.json         # PWA manifest
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
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
│   │   ├── about/           # About page components
│   │   ├── blog/            # Blog components with SWR
│   │   ├── contact/         # Contact form components
│   │   ├── experience/      # Work experience timeline
│   │   ├── forms/           # Reusable form components
│   │   ├── navigation/      # Navigation components
│   │   ├── projects/        # Project filtering components
│   │   ├── resume/          # Resume components
│   │   ├── skills/          # Skills visualization
│   │   ├── terminal/        # Interactive terminal
│   │   │   ├── hooks/       # Terminal custom hooks
│   │   │   └── types.ts     # Terminal types
│   │   └── ui/              # Reusable UI components
│   ├── context/             # React context providers
│   ├── data/                # Static data files
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and configuration
│   │   ├── api/             # API utilities and middleware
│   │   ├── config/          # Configuration constants
│   │   ├── email/           # Email service and templates
│   │   ├── validation/      # Zod schemas and validators
│   │   └── utils.ts         # Utility functions
│   ├── services/            # External service integrations
│   └── types/               # TypeScript type definitions
├── scripts/                 # Build and utility scripts
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Key Features Deep Dive

### Interactive Terminal System

The terminal provides a unique way to explore my background and work:

**Available Commands:**

- `help` - Show available commands
- `about` - Display personal information
- `experience` - Show work experience
- `skills` - List technical skills
- `projects` - Show project portfolio
- `achievements` - List certifications and achievements
- `contact` - Display contact information
- `blog` - Show latest blog posts
- `view-source` - View website source code
- `clear` - Clear terminal history

**Technical Implementation:**

- Custom hooks for state management (`useTerminal`, `useCommandHistory`)
- Real-time command execution with loading states
- Command history navigation (arrow keys)
- Typewriter effect for output display
- Error handling and fallback responses

### Advanced Project Filtering

Sophisticated filtering system with multiple capabilities:

**Search Features:**

- **Regex Support**: Advanced pattern matching (e.g., `docker|kubernetes`, `202[45]`)
- **Multi-field Search**: Title, description, highlights, technology stack, role
- **Fallback Search**: Simple text search for invalid regex patterns
- **Real-time Results**: Instant filtering and search feedback

**Technology Categories:**

```typescript
export const TECHNOLOGY_CATEGORIES = {
  frameworks: ["NestJS", "Next.js", "React", "Framer Motion", "TypeORM"],
  languages: ["TypeScript", "JavaScript", "Python", "Java", "Rust", "Bash"],
  databases: ["PostgreSQL", "MongoDB", "Redis"],
  clouds: ["AWS", "Azure", "Docker", "Kubernetes"],
  tools: ["Git", "Docker", "Kubernetes", "Jenkins", "GitHub Actions"],
};
```

**Filtering Options:**

- Multi-selection technology filters
- Open source only filter
- Usage count display
- Dynamic category organization

### GitHub Integration

Real-time GitHub data integration with multiple endpoints:

**Features:**

- **Repository Display**: Top repositories with stars and forks
- **Contribution Graph**: Visual representation of GitHub activity
- **Activity Feed**: Recent GitHub activities
- **GraphQL Integration**: Efficient data fetching
- **Caching**: Optimized API calls with caching

**API Endpoints:**

- GitHub REST API for repositories
- GitHub GraphQL API for contributions
- Rate limiting and error handling

### Blog Integration with Medium

Comprehensive blog system with RSS feed integration:

**Features:**

- **RSS Feed Parsing**: XML to JSON conversion
- **Content Caching**: Node-cache for performance
- **Pagination**: Server-side pagination
- **Image Extraction**: Automatic image URL extraction
- **Content Cleaning**: HTML sanitization
- **Error Handling**: Graceful fallbacks

**Technical Implementation:**

- XML parsing with xml2js
- Automatic cache updates every hour
- SWR for client-side data fetching
- Responsive article cards
- SEO optimization

### Contact System

Professional contact system with multiple layers of security:

**Features:**

- **AWS SES Integration**: Reliable email delivery
- **reCAPTCHA Protection**: Bot prevention
- **Form Validation**: Zod schema validation
- **Email Templates**: HTML email templates
- **Dual Notifications**: Admin and user confirmation emails

**Security Measures:**

- reCAPTCHA v3 integration
- Input sanitization and validation
- Rate limiting
- Error handling and logging

### Resume System

Automated resume delivery system:

**Features:**

- **Direct Download**: Immediate PDF download
- **Email Notification**: Automated email delivery
- **Form Validation**: Contact information validation
- **Professional Templates**: Branded email templates

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
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token

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

## 🏗 Architecture Highlights

### Modular Component Design

- **Custom Hooks**: Business logic separation (`useProjectFilters`, `useTerminal`)
- **Reusable Components**: Modular UI components with proper TypeScript interfaces
- **Performance Optimization**: React.memo, useMemo, and useCallback usage
- **Error Boundaries**: Graceful error handling throughout the application

### API Architecture

- **Middleware Pattern**: Request validation and error handling middleware
- **Response Standardization**: Consistent API response format
- **Caching Strategy**: Multi-level caching for performance
- **Error Handling**: Comprehensive error handling with proper logging

### State Management

- **Local State**: React hooks for component-level state
- **Custom Hooks**: Reusable state logic
- **Context API**: Theme and global state management
- **SWR**: Server state management with caching

### Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component with optimization
- **Lazy Loading**: Component and data lazy loading
- **Caching**: Multiple caching layers (SWR, Node-cache, Next.js cache)

## 🎨 Design System

### Color Palette

```typescript
export const THEME = {
  PRIMARY: "#ff5f1f", // Orange
  SECONDARY: "#f97316", // Orange-500
  BACKGROUND: "#000000", // Black
  TEXT: "#ffffff", // White
};
```

### Typography

- **Cyberpunk**: Orbitron (headings)
- **Terminal**: JetBrains Mono (code/terminal)
- **Retro**: Press Start 2P (special elements)
- **Matrix**: VT323 (matrix-style text)
- **Albert**: Albert Sans (body text)

### Animation System

```typescript
export const ANIMATION = {
  FAST: 0.2, // Quick interactions
  NORMAL: 0.3, // Standard transitions
  SLOW: 0.5, // Page transitions
};
```

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

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

## 📈 Recent Improvements

### v2.1 - Enhanced Performance & Security

- 🔒 Added comprehensive input validation with Zod
- ⚡ Implemented multi-level caching strategy
- 🎨 Enhanced cyberpunk design system
- 📱 Improved PWA capabilities
- 🔍 Advanced project filtering with regex support

### v2.0 - Dynamic Project Filtering

- ✨ Added regex-based project search
- 🏷️ Implemented dynamic technology categorization
- 🧩 Refactored to modular component architecture
- ⚡ Improved performance with custom hooks
- 🎯 Enhanced type safety throughout

### v1.5 - Enhanced Portfolio

- 📊 Added GitHub activity integration
- 💻 Implemented interactive terminal
- 📝 Integrated Medium blog
- 🎨 Improved cyberpunk design theme

## 📄 License

Copyright (c) 2024 Mahdi Rashidi. All rights reserved.

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
