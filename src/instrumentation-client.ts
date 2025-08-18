import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "***REMOVED***",

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 1,

  enableLogs: true,

  replaysSessionSampleRate: 0.1,

  replaysOnErrorSampleRate: 1.0,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
