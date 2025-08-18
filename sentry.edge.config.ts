import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "***REMOVED***",

  tracesSampleRate: 1,

  enableLogs: true,

  debug: false,
});
