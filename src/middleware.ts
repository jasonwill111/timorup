import { defineMiddleware } from 'astro:middleware';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Check if running in Cloudflare Workers
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

  // Inject db into locals for SSR pages
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

  // Static pages with server islands: cache HTML, islands refresh independently
  const staticPaths = ['/about', '/contact', '/faqs', '/privacy', '/terms', '/pricing', '/'];
  if (staticPaths.some(p => context.url.pathname === p || context.url.pathname === p + '/')) {
    const response = await next();
    // Homepage: 5min cache (matches server island refresh)
    // Static pages: 1 hour cache
    const maxAge = context.url.pathname === '/' || context.url.pathname === '' ? 300 : 3600;
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=3600`);
    return response;
  }

  // Business detail pages: cache 5 min (content changes infrequently)
  if (context.url.pathname.startsWith('/business/') && !context.url.pathname.includes('/edit')) {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    return response;
  }

  // Organization pages: same as business
  if (context.url.pathname.startsWith('/organization/') && !context.url.pathname.includes('/edit')) {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    return response;
  }

  // Products/Services page: cache 2 min (search results can change)
  if (context.url.pathname === '/products-services' || context.url.pathname === '/products-services/') {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return response;
  }

  // Listing pages: cache 2 min
  if (context.url.pathname === '/listing' || context.url.pathname === '/listing/') {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return response;
  }

  return next();
});
