import { ReactElement } from 'react';

export interface Command {
  input: string;
  output: string | ReactElement;
  timestamp: Date;
}

export const AVAILABLE_COMMANDS = {
  help: "Show available commands",
  about: "Display information about me",
  skills: "List my technical skills",
  projects: "Show my projects",
  contact: "Display contact information",
  clear: "Clear the terminal",
  experience: "Show my work experience",
  "view-source": "View website source code",
  achievements: "List my achievements and certifications",
  blog: "Show my latest blog posts",
  "system-info": "Display system information",
} as const;

export type CommandType = keyof typeof AVAILABLE_COMMANDS; 