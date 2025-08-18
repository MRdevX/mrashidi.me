import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://cb81afa74d17d89df0006f3399ce710f@o417124.ingest.us.sentry.io/4509866207215616",

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 1,

  enableLogs: true,

  replaysSessionSampleRate: 0.1,

  replaysOnErrorSampleRate: 1.0,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
