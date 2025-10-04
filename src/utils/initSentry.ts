import * as Sentry from "@sentry/react";

export const initSentry = () => {
  const SENTRY_DSN_KEY = import.meta.env.VITE_DSN_KEY;

  Sentry.init({
    dsn: SENTRY_DSN_KEY,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["https://admin.danuri.cloud/"],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
