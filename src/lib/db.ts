// Drizzle DB Instance - Astro 6 Cloudflare Workers + Remote Bindings
// Uses cloudflare:workers env.DB (works in both local dev and production)

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Global singleton - initialized once per Worker cold start
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get Drizzle DB instance
 * Uses cloudflare:workers env.DB - works with remote bindings in local dev
 */
export async function getDb() {
  if (_db) return _db;

  try {
    const { env } = await import('cloudflare:workers');
    if (env.DB) {
      _db = drizzle(env.DB, { schema });
    }
  } catch (e) {
    console.error('[getDb] Failed to initialize:', e);
  }

  return _db;
}

/**
 * Initialize DB with a D1Database instance (for middleware)
 */
export function initDb(d1Db: D1Database) {
  _db = drizzle(d1Db, { schema });
  return _db;
}

/**
 * Check if db is ready
 */
export function isDbReady(): boolean {
  return _db !== null;
}

// Legacy sync export - DO NOT USE
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db');
  }
};
