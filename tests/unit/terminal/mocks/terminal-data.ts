import type { Command } from "@/components/terminal/types";

export const mockCommands: Command[] = [
  {
    input: "help",
    output:
      "Available commands: help, about, skills, projects, experience, achievements, contact, blog, view-source, clear",
    timestamp: new Date("2024-01-15T14:30:45Z"),
  },
  {
    input: "about",
    output: "I'm a full-stack developer with expertise in React, Node.js, and modern web technologies.",
    timestamp: new Date("2024-01-15T14:31:12Z"),
  },
  {
    input: "skills",
    output: "Frontend: React, TypeScript, Next.js\nBackend: Node.js, Python, PostgreSQL\nTools: Git, Docker, AWS",
    timestamp: new Date("2024-01-15T14:32:00Z"),
  },
];

export const mockCommandHistory = ["help", "about", "skills", "projects"];

export const mockTerminalState = {
  commands: mockCommands,
  commandHistory: mockCommandHistory,
  isExecuting: false,
};

export const mockLoadingMessages = {
  help: "Loading available commands...",
  about: "Loading profile data...",
  skills: "Analyzing skill tree...",
  projects: "Fetching project data...",
  experience: "Loading work experience...",
  achievements: "Retrieving achievements...",
  contact: "Loading contact information...",
  blog: "Loading blog posts from API...",
  clear: "Clearing terminal...",
};

export const mockCommandOutputs = {
  help: "Available commands: help, about, skills, projects, experience, achievements, contact, blog, view-source, clear",
  about: "I'm a full-stack developer with expertise in React, Node.js, and modern web technologies.",
  skills: "Frontend: React, TypeScript, Next.js\nBackend: Node.js, Python, PostgreSQL\nTools: Git, Docker, AWS",
  projects: "Here are my featured projects:\n1. E-commerce Platform\n2. Task Management App\n3. Portfolio Website",
  experience: "Senior Developer at TechCorp (2022-present)\nJunior Developer at StartupXYZ (2020-2022)",
  achievements: "AWS Certified Developer\nReact Expert Certification\nOpen Source Contributor",
  contact: "Email: contact@example.com\nLinkedIn: linkedin.com/in/developer\nGitHub: github.com/developer",
  blog: "Latest blog posts:\n1. Getting Started with React\n2. TypeScript Best Practices\n3. Next.js Performance Tips",
  "view-source": "View source code at: github.com/developer/portfolio",
  clear: "",
};

export const mockTimestamps = {
  now: new Date("2024-01-15T14:30:45Z"),
  past: new Date("2024-01-15T14:29:30Z"),
  future: new Date("2024-01-15T14:31:00Z"),
};
