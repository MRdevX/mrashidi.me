import pino from "pino";

const redactFields = [
  "email",
  "password",
  "token",
  "key",
  "secret",
  "apiKey",
  "accessKeyId",
  "secretAccessKey",
  "fromEmail",
  "toEmail",
  "recaptchaToken",
];

const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  redact: {
    paths: redactFields,
    censor: "[REDACTED]",
  },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
});

export { logger };
