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

export const TERMINAL_CONSTANTS = {
  HEIGHT: "600px",
  WELCOME_MESSAGE: "Welcome! Type 'help' to see available commands.",
  DEFAULT_PLACEHOLDER: "Type 'help' for available commands...",
  EXECUTING_PLACEHOLDER: "Executing command...",
  ERROR_MESSAGE: "Error executing command. Please try again.",
  LOADING_MESSAGES: {
    BLOG: "Loading blog posts...",
    HELP: "Loading help...",
    DEFAULT: "Executing command...",
  },

  TYPING_SPEED: {
    FAST: 10,
    NORMAL: 20,
    SLOW: 30,
  },
  CURSOR_BLINK_RATE: 500,
  COMMAND_DELAY: 200,
} as const;

export const TERMINAL_STYLES = {
  CONTAINER:
    "w-full h-[600px] bg-black/95 rounded-lg p-4 font-mono text-sm overflow-y-auto cursor-text border border-gray-800 shadow-lg",
  PROMPT: "text-green-400 select-none font-bold",
  INPUT: "flex-1 bg-transparent border-none outline-none text-gray-300 disabled:opacity-50 placeholder-gray-600 font-mono",
  WELCOME: "text-gray-500 text-sm italic",
  TIMESTAMP: "text-gray-600 text-xs ml-auto opacity-70",

  TEXT: {
    PRIMARY: "text-gray-300",
    SECONDARY: "text-gray-400",
    SUCCESS: "text-green-400",
    WARNING: "text-yellow-400",
    ERROR: "text-red-400",
    INFO: "text-blue-400",
    MUTED: "text-gray-600",
  },
} as const;
