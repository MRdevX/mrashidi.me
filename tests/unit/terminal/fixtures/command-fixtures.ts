import type { Command } from "@/components/terminal/types";

export const validCommands = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "achievements",
  "contact",
  "blog",
  "view-source",
  "clear",
] as const;

export const invalidCommands = ["invalid", "random", "test", "xyz", "help me", "help-command", "help123"] as const;

export const commandHistoryFixtures = {
  empty: [],
  single: ["help"],
  multiple: ["help", "about", "skills"],
  long: ["help", "about", "skills", "projects", "experience", "achievements", "contact", "blog"],
  withDuplicates: ["help", "about", "help", "skills", "about"],
} as const;

export const commandOutputFixtures = {
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
} as const;

export const createCommandFixture = (input: string, output: string, timestamp?: Date) => ({
  input,
  output,
  timestamp: timestamp || new Date(),
});

export const commandObjectFixtures = {
  help: createCommandFixture("help", commandOutputFixtures.help),
  about: createCommandFixture("about", commandOutputFixtures.about),
  skills: createCommandFixture("skills", commandOutputFixtures.skills),
} as const;

export const terminalStateFixtures = {
  empty: {
    commands: [],
    commandHistory: [],
    isExecuting: false,
  },
  withCommands: {
    commands: Object.values(commandObjectFixtures),
    commandHistory: ["help", "about", "skills"],
    isExecuting: false,
  },
  executing: {
    commands: [],
    commandHistory: [],
    isExecuting: true,
  },
  mixed: {
    commands: [commandObjectFixtures.help],
    commandHistory: ["help"],
    isExecuting: false,
  },
} as const;

export const inputValidationFixtures = {
  valid: ["help", "about", "  skills  ", "PROJECTS", "About"],
  invalid: ["invalid", "random", "test123", "help me", "help-command", "help123"],
} as const;

export const timeUtils = {
  now: () => new Date(),
  past: (minutesAgo: number = 1) => new Date(Date.now() - minutesAgo * 60 * 1000),
  future: (minutesFromNow: number = 1) => new Date(Date.now() + minutesFromNow * 60 * 1000),

  atTime: (hours: number, minutes: number, seconds: number = 0) =>
    new Date(
      `2024-01-15T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}Z`
    ),
} as const;
