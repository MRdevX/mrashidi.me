import pino from "pino";

const pinoLogger = pino({
  level: "info",
});

export const logger = {
  debug: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    pinoLogger.debug(logData);
  },

  info: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    pinoLogger.info(logData);
  },

  warn: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    pinoLogger.warn(logData);
  },

  error: (message: string | Record<string, unknown>, data?: unknown) => {
    const logData = typeof message === "string" ? { message, ...(data ? { data } : {}) } : message;
    pinoLogger.error(logData);
  },
};
