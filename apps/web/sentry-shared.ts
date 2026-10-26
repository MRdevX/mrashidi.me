import type { NodeOptions } from "@sentry/nextjs";

export const sentrySharedOptions: NodeOptions = {
  dsn: process.env.SENTRY_DSN,

  enabled: process.env.NODE_ENV === "production",

  tracesSampleRate: 0.1,

  debug: false,

  beforeSend(event) {
    if (event.level === "warning" || event.level === "info") {
      return null;
    }
    return event;
  },
};
