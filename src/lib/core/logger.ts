import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

const pinoLogger = pino({
  level: isDevelopment ? "debug" : "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
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
