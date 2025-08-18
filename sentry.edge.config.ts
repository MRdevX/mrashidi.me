import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://cb81afa74d17d89df0006f3399ce710f@o417124.ingest.us.sentry.io/4509866207215616",

  tracesSampleRate: 1,

  enableLogs: true,

  debug: false,
});
