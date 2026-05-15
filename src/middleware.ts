import { defineMiddleware } from 'astro:middleware';
import { getDb } from './lib/db';

/**
 * DB Initialization Middleware
 * Initializes D1 binding once per Worker cold start.
 * This is separate from Admin Auth which lives in src/middleware/index.ts
 */

let bindingsInitialized = false;

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize D1 binding once per Worker cold start
  if (!bindingsInitialized) {
    try {
      const db = await getDb();
      if (db) {
        bindingsInitialized = true;
        console.log('[Middleware] DB initialized');
      }
    } catch (e: unknown) {
      console.error('[Middleware] DB init failed:', e instanceof Error ? e.message : String(e));
    }
  }

  // Simple pass-through
  return next();
});
