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
    BLOG_UPDATE_INTERVAL: 1000 * 60 * 60,
    REVALIDATE_TIME: 3600,
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

export const BLOG_AUTHORS = [
  {
    username: "mrdevx",
    name: "Mahdi Rashidi",
    mediumUrl: "https://mrdevx.medium.com",
  },
] as const;

export const THEME = {
  PRIMARY: "#ff5f1f",
  SECONDARY: "#f97316",
  BACKGROUND: "#000000",
  TEXT: "#ffffff",
} as const;

export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;
