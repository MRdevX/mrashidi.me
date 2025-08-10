import { ReactElement } from "react";

export interface Command {
  input: string;
  output: string | ReactElement;
  timestamp: Date;
}

export const AVAILABLE_COMMANDS = {
  help: "Show available commands",
  about: "Display information about me",
  experience: "Show my work experience",
  skills: "List my technical skills",
  projects: "Show my projects",
  achievements: "List my achievements and certifications",
  contact: "Display contact information",
  blog: "Show my latest blog posts",
  "view-source": "View website source code",
  clear: "Clear the terminal",
} as const;

export type CommandType = keyof typeof AVAILABLE_COMMANDS;
