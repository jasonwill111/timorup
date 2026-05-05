import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
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

  // Listings pages: cache 2 min
  if (context.url.pathname === '/listings' || context.url.pathname === '/listings/') {
    const response = await next();
    response.headers.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    return response;
  }

  return next();
});