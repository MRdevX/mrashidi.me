export type ProjectVisibility = "public" | "private";
export type ProjectType = "personal" | "client";

export interface Project {
  title: string;
  description: string;
  highlights?: string[];
  stack: string[];
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
    title: "EV Fleet Management Platform Suite",
    description:
      "A comprehensive suite of tools for an EV SaaS provider, including fleet assessment, mobile employee assistant, and infrastructure orchestration. Delivered scalable microservices, real-time integrations, and IoT-ready backend for enterprise clients transitioning to e-mobility.",
    highlights: [
      "Fleet Assessment: Usage analysis, cost projections, charging strategy recommendations.",
      "Mobile Assistant: Cross-platform app for employees to locate charging stations and manage EVs.",
      "Infrastructure Orchestration: Real-time monitoring and automated workflows for 1000+ charging stations.",
      "Built scalable microservices architecture with gRPC communication across services.",
      "Enabled cost & CO₂ savings projections using custom models.",
      "Delivered employee-first mobile UX for EV fleet users.",
      "Enabled session tracking and charge cost summaries.",
      "Connected real-time backend via microservices + gRPC.",
      "Designed IoT-ready backend architecture.",
      "Automated installation workflows across stakeholders.",
      "Integrated service monitoring for 1000+ stations.",
      "Integrated CI/CD and cloud deployment (Azure, GitLab).",
    ],
    stack: [
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "gRPC",
      "Docker",
      "Kubernetes",
      "Azure",
      "GitLab CI/CD",
      "React",
      "React Native",
      "Java",
    ],
    githubUrl: undefined,
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
    year: "2021–2025",
    role: "Senior Backend Engineer",
    status: "active",
    clientName: "Confidential (EV SaaS Provider)",
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
    title: "Flight Operations Platform",
    description:
      "Real-time aviation operations management system with flight tracking, weather data integration, and pilot communication features. Implemented robust authentication and logging systems.",
    highlights: [
      "Integrated real-time weather data",
      "Built robust authentication system",
      "Enabled pilot communication features",
    ],
    stack: ["Node.js", "MongoDB", "Redis", "WebSocket", "Docker", "AWS"],
    githubUrl: undefined,
    liveUrl: undefined,
    visibility: "private",
    type: "client",
    openSource: false,
    year: "2021-2022",
    role: "Backend Engineer",
    status: "active",
    clientName: "Mehrpardaz Co",
  },
];
