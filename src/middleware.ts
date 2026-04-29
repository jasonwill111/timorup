import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Static-like pages: cache at CDN for 1 hour
  const staticPaths = ['/about', '/contact', '/faqs', '/privacy', '/terms', '/pricing'];
  if (staticPaths.some(p => context.url.pathname.startsWith(p))) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  return response;
});
