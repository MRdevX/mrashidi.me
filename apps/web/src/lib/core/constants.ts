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
  RATE_LIMIT: {
    CONTACT_FORM: {
      requests: 5,
      window: "1 m",
    },
    RESUME_REQUEST: {
      requests: 5,
      window: "1 m",
    },
    CV_UPLOAD: {
      requests: 3,
      window: "1 h",
    },
    GENERAL_API: {
      requests: 100,
      window: "1 m",
    },
    ASK_MR: {
      requests: 10,
      window: "1 m",
    },
    ASK_MR_DAILY: {
      requests: 60,
      window: "1 d",
    },
    ASK_MR_FEEDBACK: {
      requests: 30,
      window: "1 m",
    },
  },
  CORS: {
    ALLOWED_ORIGINS: ["*"],
    ALLOWED_METHODS: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    ALLOWED_HEADERS: ["*"],
    MAX_AGE: 86400,
  },
} as const;
