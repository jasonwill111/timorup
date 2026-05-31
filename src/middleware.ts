/**
 * Astro Middleware - Security Headers
 * 
 * Adds security headers to all HTTP responses to protect against:
 * - XSS attacks (X-Content-Type-Options)
 * - Clickjacking (X-Frame-Options)
 * - Information leakage (Referrer-Policy)
 * - Unwanted browser features (Permissions-Policy)
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security
 * @see https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
 */

import { defineMiddleware } from 'astro:middleware';

/**
 * Security headers to add to all responses
 */
const SECURITY_HEADERS = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Control referrer information sent with requests
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Restrict browser features and APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',

  // XSS protection (legacy but still useful for older browsers)
  'X-XSS-Protection': '1; mode=block',

  // Content Security Policy - XSS protection
  // Allows: self, inline styles/scripts for Tailwind/animation, fonts from Google, images from any HTTPS
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
};

/**
 * Cache-Control headers for different response types
 */
const CACHE_HEADERS = {
  // Static assets can be cached
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  // Dynamic pages should not be cached
  dynamic: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export const onRequest = defineMiddleware(async (context, next) => {
  // CSRF Protection for mutation requests
  const mutationMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  if (mutationMethods.includes(context.request.method)) {
    const origin = context.request.headers.get('origin');
    const host = context.request.headers.get('host');

    // Allow if same origin or no origin header (same-site request)
    if (origin) {
      try {
        const originUrl = new URL(origin);
        // Block if origin doesn't match host (cross-site request)
        // Allow localhost in development
        const isLocalhost = originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1';
        const hostIsLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
        if (originUrl.host !== host && !(isLocalhost && hostIsLocalhost)) {
          return new Response('CSRF validation failed', {
            status: 403,
            statusText: 'Forbidden',
          });
        }
      } catch {
        // Invalid origin header, block just in case
        return new Response('Invalid origin', { status: 403 });
      }
    }
  }

  // Get the response from the next handler
  const response = await next();
  
  // Determine if this is a response for a static asset
  const url = context.url;
  const isStaticAsset = url.pathname.startsWith('/_astro/') ||
                        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
  
  // Apply appropriate headers
  const headersToSet = isStaticAsset ? { ...SECURITY_HEADERS, ...CACHE_HEADERS.static } 
                                    : { ...SECURITY_HEADERS, ...CACHE_HEADERS.dynamic };
  
  // Clone response and add headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers),
      ...headersToSet,
    },
  });
  
  return newResponse;
});