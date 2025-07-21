// Project data model and list for use across the app

export type ProjectVisibility = "public" | "private";
export type ProjectType = "personal" | "client";

export interface Project {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
  stackIcons?: string[]; // icon names for each tech
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  imageUrl?: string;
  logoUrl?: string;
  visibility: ProjectVisibility;
  openSource?: boolean;
  license?: string;
  year?: string;
  type: ProjectType;
  clientName?: string;
  clientLogoUrl?: string;
  role?: string;
  status?: "active" | "archived" | "in progress" | "maintenance";
}

export const projects: Project[] = [
  {
    title: "E-Mobility Services Platform",
    description:
      "Cloud-native platform managing 1,500+ European charging stations, featuring real-time monitoring, automated scaling, and GDPR-compliant data handling. Achieved 45% cost reduction through infrastructure optimization.",
    highlights: [
      "Reduced infrastructure costs by 45%",
      "Managed 1,500+ charging stations across Europe",
      "Implemented GDPR-compliant data handling",
      "Led migration from GCP to Azure with zero downtime",
    ],
    stack: ["Azure", "Kubernetes", "NestJS", "TypeScript", "PostgreSQL", "Redis"],
    stackIcons: ["azure", "kubernetes", "nestjs", "typescript", "postgresql", "redis"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
    year: "2022-2023",
    role: "Lead Backend Engineer",
    status: "active",
    clientName: "Fakir Technology Consultants GmbH",
  },
  {
    title: "Personal Portfolio Website",
    description:
      "A modern, responsive portfolio site built with Next.js and Tailwind CSS to showcase my work, blog, and resume. Features dark mode, animated backgrounds, and a custom terminal.",
    highlights: [
      "Custom interactive terminal component",
      "Animated backgrounds with Framer Motion",
      "Fully responsive and accessible design",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    stackIcons: ["nextjs", "react", "tailwindcss", "framermotion"],
    githubUrl: "https://github.com/mrdevx/mrashidi.me",
    liveUrl: "https://mrashidi.me",
    visibility: "public",
    type: "personal",
    openSource: true,
    license: "MIT",
    year: "2024",
    role: "Creator & Maintainer",
    status: "active",
  },
  {
    title: "Open Source CLI Tool",
    description:
      "A cross-platform command-line tool for automating repetitive development tasks. Includes plugin support and a beautiful interactive UI.",
    highlights: ["Plugin-based architecture", "Interactive UI with Inquirer.js", "Cross-platform support"],
    stack: ["Node.js", "TypeScript", "Inquirer.js"],
    stackIcons: ["nodejs", "typescript", "inquirerjs"],
    githubUrl: "https://github.com/mrdevx/dev-cli-tool",
    liveUrl: undefined,
    visibility: "public",
    type: "personal",
    openSource: true,
    license: "MIT",
    year: "2023",
    role: "Creator",
    status: "maintenance",
  },
  {
    title: "Flight Operations Platform",
    description:
      "Real-time aviation operations management system with flight tracking, weather data integration, and pilot communication features. Implemented robust authentication and logging systems.",
    highlights: [
      "Integrated real-time weather data",
      "Built robust authentication system",
      "Enabled pilot communication features",
    ],
    stack: ["Node.js", "MongoDB", "Redis", "WebSocket", "Docker", "AWS"],
    stackIcons: ["nodejs", "mongodb", "redis", "websocket", "docker", "aws"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
    year: "2021-2022",
    role: "Backend Engineer",
    status: "archived",
    clientName: "Mehrpardaz Co",
  },
  {
    title: "Open Banking System",
    description:
      "Secure banking integration platform with enhanced authentication, rate limiting, and comprehensive error logging. Built with a focus on security and reliability.",
    highlights: ["Implemented advanced rate limiting", "Comprehensive error logging", "Focus on security and reliability"],
    stack: ["NestJS", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes"],
    stackIcons: ["nestjs", "postgresql", "redis", "rabbitmq", "docker", "kubernetes"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
    year: "2020-2021",
    role: "Backend Engineer",
    status: "archived",
    clientName: "Mehrpardaz Co",
  },
];
