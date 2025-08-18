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

  base: {
    env: process.env.NODE_ENV,
  },
});

export { logger };
