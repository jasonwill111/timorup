// Drizzle DB Instance - Astro 6 Cloudflare Workers + Remote Bindings
// Uses cloudflare:workers env.DB (works in both local dev and production)

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Type for Cloudflare Workers env
interface CfEnv {
  DB?: D1Database;
  SESSION?: KVNamespace;
  MEDIA_BUCKET?: R2Bucket;
  [key: string]: unknown;
}

// Global singleton - initialized once per Worker cold start
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _rawDb: D1Database | null = null;

/**
 * Get Drizzle DB instance
 * Uses cloudflare:workers env.DB - works with remote bindings in local dev
 */
export async function getDb(): Promise<ReturnType<typeof drizzle<typeof schema>> | null> {
  // Always check env first - don't rely on cached _db
  try {
    // Try to get env from cloudflare:workers module
    let cfEnv: { DB?: D1Database } | null = null;

    try {
      const { env: workersEnv } = await import('cloudflare:workers');
      cfEnv = workersEnv as { DB?: D1Database };
    } catch {
      // cloudflare:workers not available, try globalThis
      cfEnv = (globalThis as unknown as { env?: { DB?: D1Database } }).env;
    }

    if (cfEnv?.DB) {
      const freshDb = drizzle(cfEnv.DB as D1Database, { schema });
      _db = freshDb; // Update cache
      _rawDb = cfEnv.DB as D1Database; // Store raw D1 for direct queries
      console.log('[getDb] Fresh DB initialized from cloudflare:workers env.DB');
      return freshDb;
    } else {
      console.error('[getDb] env.DB not available. CF_ENV keys:', Object.keys(cfEnv || {}));
      if (_db) return _db; // Return cached if available
      return null;
    }
  } catch (e) {
    console.error('[getDb] Failed to initialize:', e);
    return _db; // Return cached if available
  }
}

/**
 * Get raw D1Database instance for direct queries
 * Use this when Drizzle ORM has compatibility issues with D1
 */
export async function getRawDb(): Promise<D1Database | null> {
  if (_rawDb) return _rawDb;

  try {
    const { env: workersEnv } = await import('cloudflare:workers');
    const cfEnv = workersEnv as { DB?: D1Database };
    if (cfEnv?.DB) {
      _rawDb = cfEnv.DB as D1Database;
      return _rawDb;
    }
  } catch {
    // cloudflare:workers not available
  }
  return _rawDb;
}

/**
 * Initialize DB with a D1Database instance (for middleware)
 */
export function initDb(d1Db: D1Database): ReturnType<typeof drizzle<typeof schema>> {
  _db = drizzle(d1Db, { schema });
  _rawDb = d1Db;
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
