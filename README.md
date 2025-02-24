# mrashidi.me

This is my personal website and portfolio, showcasing my work as a Senior Backend Engineer & Cloud Architect. Built with Next.js, TypeScript, and Tailwind CSS, featuring an interactive terminal, real-time GitHub activity tracking, and blog integration.

> **Note**: This is my personal website and is not intended to be used as a template. The code is shared for transparency and demonstration of my work, but all rights are reserved.

## Overview

The website features a cyberpunk-inspired design with modern UI/UX elements, including:

## Features

- 🎨 Cyberpunk-inspired design with modern UI/UX
- 💻 Interactive terminal interface
- 📊 Real-time GitHub activity and contribution graph
- 📝 Blog integration with Medium
- 🌐 Responsive layout for all devices
- ⚡ Fast page loads with Next.js 14
- 🔍 SEO optimized with meta tags and sitemap
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔄 Automatic sitemap generation
- 🌙 Dark mode optimized

## Tech Stack

- **Framework**: Next.js 14
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
│   ├── services/    # API services
│   ├── types/       # TypeScript types
│   └── styles/      # Global styles
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

## Available Commands

- `yarn dev` - Start development server
- `yarn build` - Build production version
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn generate-sitemap` - Generate sitemap

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
- Location: Istanbul, Turkey
