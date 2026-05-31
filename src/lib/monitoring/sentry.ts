/**
 * Sentry initialization for Cloudflare Workers
 * Captures errors and performance data
 */
import * as Sentry from '@sentry/cloudflare';

export function initSentry(env: { SENTRY_DSN?: string }) {
  if (!env.SENTRY_DSN) {
    console.warn('[Sentry] SENTRY_DSN not configured - error tracking disabled');
    return null;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: import.meta.env.PROD ? 'production' : 'development',
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    debug: !import.meta.env.PROD,
    // Enable all integrations for Cloudflare Workers
    integrations: (integrations) => {
      return integrations.filter((integration) => {
        // Filter out browser-specific integrations
        if (integration.name === 'BrowserConsoleErrors') return false;
        if (integration.name === 'Breadcrumbs') return false;
        return true;
      });
    },
  });

  console.log('[Sentry] Initialized successfully');
  return Sentry;
}

export { Sentry };