import { defineMiddleware } from 'astro:middleware';
import * as schema from '@/db/schema';

// Lazy check for Cloudflare Workers runtime
let isCloudflareWorkersChecked = false;
let isCloudflareWorkers: boolean | null = null;

async function checkCloudflareWorkers(): Promise<boolean> {
  if (isCloudflareWorkersChecked) return isCloudflareWorkers ?? false;
  isCloudflareWorkersChecked = true;
  // Use globalThis check to avoid Vite resolution
  const isWorkers = typeof globalThis.__CF_WORKERS__ !== 'undefined' ||
                    (typeof process !== 'undefined' && process.env?.CF_WORKERS === 'true');
  if (isWorkers) {
    isCloudflareWorkers = true;
    return true;
  }
  // Try dynamic import only if not in Node
  if (typeof process !== 'undefined' && process.versions?.node) {
    isCloudflareWorkers = false;
    return false;
  }
  try {
    await import('cloudflare:workers');
    isCloudflareWorkers = true;
  } catch {
    isCloudflareWorkers = false;
  }
  return isCloudflareWorkers;
}

// Get DB - shared with lib/db.ts
async function getDbFromEnv() {
  try {
    const { drizzle } = await import('drizzle-orm/d1');
    const { env } = await import('cloudflare:workers');
    const cfEnv = env as { DB?: any };
    if (cfEnv.DB) {
      return drizzle(cfEnv.DB, { schema });
    }
  } catch {
    return null;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Only try to inject DB in Cloudflare Workers
  if (typeof globalThis.__CF_WORKERS__ !== 'undefined' || process.env?.CF_WORKERS === 'true') {
    const db = await getDbFromEnv();
    if (db) {
      context.locals.db = db;
    }
  }

  // Static pages with server islands: cache HTML, islands refresh independently
  const staticPaths = ['/about', '/contact', '/faqs', '/privacy', '/terms', '/pricing', '/'];
  if (staticPaths.some(p => context.url.pathname === p || context.url.pathname === p + '/')) {
    const response = await next();
    const maxAge = context.url.pathname === '/' || context.url.pathname === '' ? 300 : 3600;
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=3600`);
    return response;
  }

  // Business detail pages: cache 5 min
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

  // Products/Services page: cache 2 min
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