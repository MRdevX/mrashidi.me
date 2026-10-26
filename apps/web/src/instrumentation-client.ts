import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";

// Invisible bot check for Ask MR (verified server-side with `checkBotId()`).
initBotId({
  protect: [
    { path: "/api/chat", method: "POST" },
    { path: "/api/chat/feedback", method: "POST" },
  ],
});

Sentry.init({
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
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
