interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLogLevel = (process.env.NODE_ENV === "production" ? "INFO" : "DEBUG") as keyof LogLevel;

function shouldLog(level: keyof LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

function formatMessage(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataString = data ? ` | ${JSON.stringify(data)}` : "";
  return `[${timestamp}] ${level}: ${message}${dataString}`;
}

export const logger = {
  debug: (message: string | Record<string, unknown>, data?: unknown) => {
    if (shouldLog("DEBUG")) {
      if (typeof message === "string") {
        console.debug(formatMessage("DEBUG", message, data));
      } else {
        const logData = data ? { ...message, data } : message;
        console.debug(formatMessage("DEBUG", "Debug message", logData));
      }
    }
  },

  info: (message: string | Record<string, unknown>, data?: unknown) => {
    if (shouldLog("INFO")) {
      if (typeof message === "string") {
        console.info(formatMessage("INFO", message, data));
      } else {
        const logData = data ? { ...message, data } : message;
        console.info(formatMessage("INFO", "Info message", logData));
      }
    }
  },

  warn: (message: string | Record<string, unknown>, data?: unknown) => {
    if (shouldLog("WARN")) {
      if (typeof message === "string") {
        console.warn(formatMessage("WARN", message, data));
      } else {
        const logData = data ? { ...message, data } : message;
        console.warn(formatMessage("WARN", "Warning message", logData));
      }
    }
  },

  error: (message: string | Record<string, unknown>, data?: unknown) => {
    if (shouldLog("ERROR")) {
      if (typeof message === "string") {
        console.error(formatMessage("ERROR", message, data));
      } else {
        const logData = data ? { ...message, data } : message;
        console.error(formatMessage("ERROR", "Error message", logData));
      }
    }
  },

  log: (level: keyof LogLevel, message: string, data?: unknown) => {
    if (shouldLog(level)) {
      const logData = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(data ? { data } : {}),
      };

      switch (level) {
        case "DEBUG":
          console.debug(logData);
          break;
        case "INFO":
          console.info(logData);
          break;
        case "WARN":
          console.warn(logData);
          break;
        case "ERROR":
          console.error(logData);
          break;
      }
    }
  },
};
