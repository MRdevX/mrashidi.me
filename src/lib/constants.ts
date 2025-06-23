// API Configuration
export const API_CONFIG = {
  GITHUB: {
    BASE_URL: "https://api.github.com",
    GRAPHQL_URL: "https://api.github.com/graphql",
    USERNAME: "mrdevx",
  },
  RECAPTCHA: {
    THRESHOLD: 0.5,
  },
  CACHE: {
    BLOG_UPDATE_INTERVAL: 1000 * 60 * 60, // 1 hour
    REVALIDATE_TIME: 3600, // 1 hour
  },
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

// Blog authors configuration
export const BLOG_AUTHORS = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
] as const;

// Theme colors
export const THEME = {
  PRIMARY: "#ff5f1f",
  SECONDARY: "#f97316",
  BACKGROUND: "#000000",
  TEXT: "#ffffff",
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;
