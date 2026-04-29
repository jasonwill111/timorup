import { defineMiddleware } from 'astro:middleware';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Check if running in Cloudflare Workers - use a more reliable method
// cloudflare:workers module exists only in Workers runtime
let isCloudflareWorkersChecked = false;
let isCloudflareWorkers: boolean | null = null;

async function checkCloudflareWorkers(): Promise<boolean> {
  if (isCloudflareWorkersChecked) return isCloudflareWorkers ?? false;
  isCloudflareWorkersChecked = true;
  try {
    await import('cloudflare:workers');
    isCloudflareWorkers = true;
  } catch {
    isCloudflareWorkers = false;
  }
  return isCloudflareWorkers;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const isWorkers = await checkCloudflareWorkers();

  // Inject db into locals
  if (isWorkers) {
    try {
      const { env } = await import('cloudflare:workers');
      const cfEnv = env as { DB?: any };
      if (cfEnv.DB) {
        context.locals.db = drizzle(cfEnv.DB, { schema });
      }
    } catch (e) {
      console.error('[Middleware] Error loading cloudflare:workers:', e);
    }
  }

  // Static-like pages: cache at CDN for 1 hour
  const staticPaths = ['/about', '/contact', '/faqs', '/privacy', '/terms', '/pricing'];
  if (staticPaths.some(p => context.url.pathname.startsWith(p))) {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return response;
  }

  return next();
});
