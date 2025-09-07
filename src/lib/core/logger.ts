const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  debug: (message: string | Record<string, unknown>, data?: unknown) => {
    if (isDevelopment) {
      const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
      console.debug("[DEBUG]", logData);
    }
  },

  info: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    console.info("[INFO]", logData);
  },

  warn: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    console.warn("[WARN]", logData);
  },

  error: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    console.error("[ERROR]", logData);
  },
};
