export const API_CONSTANTS = {
  ENDPOINTS: {
    BLOG: "/api/blog",
    CONTACT: "/api/contact",
    RESUME: "/api/resume",
  },
  TIMEOUTS: {
    DEFAULT: 10000,
    SHORT: 5000,
    LONG: 30000,
  },
} as const;

export const UI_CONSTANTS = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
} as const;

export const ANIMATION_CONSTANTS = {
  DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASINGS: {
    EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
    EASE_OUT: "cubic-bezier(0, 0, 0.2, 1)",
    EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const TERMINAL_CONSTANTS = {
  COMMANDS: {
    HELP: "help",
    ABOUT: "about",
    EXPERIENCE: "experience",
    SKILLS: "skills",
    PROJECTS: "projects",
    CONTACT: "contact",
    BLOG: "blog",
    CLEAR: "clear",
  },
  TYPING_SPEED: {
    FAST: 10,
    NORMAL: 20,
    SLOW: 30,
  },
} as const;

export const CACHE_CONSTANTS = {
  TTL: {
    SHORT: 60 * 5,
    MEDIUM: 60 * 30,
    LONG: 60 * 60,
    DAY: 60 * 60 * 24,
  },
  KEYS: {
    BLOG_POSTS: "blog_posts",
    GITHUB_ACTIVITY: "github_activity",
    PROJECT_COMMITS: "project_commits",
  },
} as const;
