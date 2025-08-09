# mrashidi.me

This is my personal website and portfolio, showcasing my work as a Senior Backend Engineer & Cloud Architect. Built with Next.js, TypeScript, and Tailwind CSS, featuring an interactive terminal, real-time GitHub activity tracking, dynamic project filtering, and blog integration.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

## Overview

The website features a cyberpunk-inspired design with modern UI/UX elements, including:

## Features

- 🎨 Cyberpunk-inspired design with modern UI/UX
- 💻 Interactive terminal interface
- 📊 Real-time GitHub activity and contribution graph
- 🔍 Advanced project filtering with regex search
- 🏷️ Dynamic technology stack categorization
- 📝 Blog integration with Medium
- 🌐 Responsive layout for all devices
- ⚡ Fast page loads with Next.js 15
- 🔍 SEO optimized with meta tags and sitemap
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔄 Automatic sitemap generation
- 🌙 Dark mode optimized
- 🧩 Modular component architecture

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Components**: Headless UI, Radix UI
- **Deployment**: Vercel
- **Package Manager**: Yarn

## Development

This repository contains the source code for my personal website. While the code is publicly available, it is not intended to be used as a template or boilerplate. If you're interested in how certain features are implemented, feel free to explore the code, but please respect the license terms.

### Prerequisites

- Node.js 18 or higher
- Yarn package manager
- GitHub Personal Access Token (for GitHub integration)

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mrdevx/mrashidi.me.git
   cd mrashidi.me
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your GitHub token:

   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
   ```

4. Run the development server:

   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   │   ├── projects/ # Project-related components
│   │   ├── forms/    # Form components
│   │   ├── terminal/ # Terminal interface
│   │   └── ui/       # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API services
│   ├── lib/          # Utilities and constants
│   ├── types/        # TypeScript types
│   └── data/         # Static data files
├── scripts/         # Build scripts
└── tailwind.config.ts
```

## Features

### Interactive Terminal

- Custom-built terminal interface with command history
- Supports various commands for exploring my background and work
- Real-time command execution

### GitHub Integration

- Real-time repository display
- Contribution graph visualization
- Activity feed integration
- Project statistics

### Advanced Project Filtering

- **Regex Search**: Search projects using regular expressions
- **Dynamic Categories**: Technology stack categorization system
- **Multi-selection Filters**: Filter by multiple technologies simultaneously
- **Real-time Results**: Instant filtering and search results
- **Extensible Architecture**: Easy to add new technology categories

#### Technology Categories

The project filtering system uses a dynamic categorization approach:

```typescript
// Add new categories in src/lib/constants.ts
export const TECHNOLOGY_CATEGORIES = {
  frameworks: ["NestJS", "Next.js", "React", "Framer Motion"],
  languages: ["TypeScript", "JavaScript", "Python", "Java", "Rust", "Bash"],
  databases: ["PostgreSQL", "MongoDB", "Redis"],
  clouds: ["AWS", "Azure", "Docker", "Kubernetes"],
  tools: ["Git", "Docker", "Kubernetes", "Jenkins", "GitHub Actions"],
  // New categories are automatically supported
};
```

### Blog Section

- Medium blog integration
- Responsive article cards
- Image optimization
- Pagination support

### Portfolio Projects

- Showcase of my professional work
- Detailed project descriptions
- Technology stack highlights
- Professional experience timeline
- Interactive filtering and search

## Architecture Highlights

### Modular Component Design

The projects page uses a clean, modular architecture:

- **Custom Hooks**: `useProjectFilters` for business logic
- **Reusable Components**: `ProjectSearchBox`, `ProjectFilters`, `ProjectResults`
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance**: Optimized with React.memo and useMemo

### Dynamic Technology Categories

The system automatically adapts to new technology categories:

1. **Add Category**: Define in `TECHNOLOGY_CATEGORIES`
2. **Add Display Name**: Update `CATEGORY_DISPLAY_NAMES`
3. **Automatic Integration**: UI and filtering work immediately

### Search Capabilities

- **Regex Support**: Advanced pattern matching
- **Multi-field Search**: Title, description, highlights, stack, role
- **Fallback Search**: Simple text search for invalid regex
- **Real-time Results**: Instant search feedback

## Available Commands

- `yarn dev` - Start development server
- `yarn build` - Build production version
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn generate-sitemap` - Generate sitemap

## Recent Improvements

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

## License

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

## Contact

Mahdi Rashidi

- GitHub: [@mrdevx](https://github.com/mrdevx)
- Email: contact@mrashidi.me
- Location: Berlin, Germany
