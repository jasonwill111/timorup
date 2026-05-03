// Drizzle DB Instance - Astro 6 Cloudflare Workers
// Supports both Workers runtime and local development

import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleLocal } from 'drizzle-orm/better-sqlite3';
import SQLite from 'better-sqlite3';
import * as schema from '@/db/schema';

// Check if running in Cloudflare Workers runtime
async function isWorkersRuntime(): Promise<boolean> {
  try {
    await import('cloudflare:workers');
    return true;
  } catch {
    return false;
  }
}

// Get D1 database binding
export async function getDb() {
  // 1. Try Astro.locals (set by middleware)
  if (typeof Astro !== 'undefined' && (Astro as any).locals?.db) {
    return (Astro as any).locals.db;
  }

  // 2. Try Cloudflare Workers runtime
  if (await isWorkersRuntime()) {
    const { env } = await import('cloudflare:workers');
    const cfEnv = env as { DB?: any };
    if (cfEnv.DB) {
      return drizzle(cfEnv.DB, { schema });
    }
  }

  // 3. Local development: use local SQLite file
  const localDbPath = process.env.LOCAL_DB_PATH || './.wrangler/state/v3/d1/timorlist-db.sqlite';
  try {
    const sqlite = new SQLite(localDbPath);
    return drizzleLocal(sqlite, { schema });
  } catch (e) {
    console.error('[getDb] Local DB not available:', e);
    throw new Error('D1 not available. Ensure middleware is properly configured.');
  }
}

// Legacy sync export - DO NOT USE
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db. The synchronous db export does not work in Cloudflare Workers.');
  }
};
