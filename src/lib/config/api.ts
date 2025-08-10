export const API_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  CACHE: {
    BLOG_UPDATE_INTERVAL: 1000 * 60 * 60,
    BLOG_REVALIDATE: 3600,
  },
  RECAPTCHA: {
    THRESHOLD: 0.5,
    VERIFY_URL: "https://www.google.com/recaptcha/api/siteverify",
  },
  MEDIUM: {
    USER_AGENT: "Mozilla/5.0 (compatible; BlogFetcher/1.0)",
    ACCEPT_HEADER: "application/xml",
  },
} as const;
