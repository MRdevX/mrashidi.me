// Project data model and list for use across the app

export type ProjectVisibility = "public" | "private";
export type ProjectType = "personal" | "client";

export interface Project {
  title: string;
  description: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  visibility: ProjectVisibility;
  type: ProjectType;
  openSource: boolean;
}

export const projects: Project[] = [
  {
    title: "E-Mobility Services Platform",
    description:
      "Cloud-native platform managing 1,500+ European charging stations, featuring real-time monitoring, automated scaling, and GDPR-compliant data handling. Achieved 45% cost reduction through infrastructure optimization.",
    stack: ["Azure", "Kubernetes", "NestJS", "TypeScript", "PostgreSQL", "Redis"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
  },
  {
    title: "Flight Operations Platform",
    description:
      "Real-time aviation operations management system with flight tracking, weather data integration, and pilot communication features. Implemented robust authentication and logging systems.",
    stack: ["Node.js", "MongoDB", "Redis", "WebSocket", "Docker", "AWS"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
  },
  {
    title: "Open Banking System",
    description:
      "Secure banking integration platform with enhanced authentication, rate limiting, and comprehensive error logging. Built with a focus on security and reliability.",
    stack: ["NestJS", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes"],
    githubUrl: undefined, // private repo
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
  },
  // --- Personal Project Sample ---
  {
    title: "Personal Portfolio Website",
    description:
      "A modern, responsive portfolio site built with Next.js and Tailwind CSS to showcase my work, blog, and resume. Features dark mode, animated backgrounds, and a custom terminal.",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/mrdevx/mrashidi.me",
    liveUrl: "https://mrashidi.me",
    visibility: "public",
    type: "personal",
    openSource: true,
  },
  {
    title: "Open Source CLI Tool",
    description:
      "A cross-platform command-line tool for automating repetitive development tasks. Includes plugin support and a beautiful interactive UI.",
    stack: ["Node.js", "TypeScript", "Inquirer.js"],
    githubUrl: "https://github.com/mrdevx/dev-cli-tool",
    liveUrl: undefined,
    visibility: "public",
    type: "personal",
    openSource: true,
  },
];
