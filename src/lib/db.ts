// Drizzle DB Instance - Astro 6 Cloudflare Workers
// Supports both Workers runtime and local development

import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Force local SQLite when not in production Cloudflare Workers
const FORCE_LOCAL = process.env.NODE_ENV !== 'production' || process.env.WRANGLER_DEV === '1';

// Check if running in actual Cloudflare Workers
async function isWorkersRuntime(): Promise<boolean> {
  if (FORCE_LOCAL) return false;
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

  // 2. Production (real Cloudflare Workers): use D1 binding
  if (await isWorkersRuntime()) {
    const { env } = await import('cloudflare:workers');
    const cfEnv = env as { DB?: any };
    if (cfEnv.DB) {
      console.log('[getDb] Using D1 binding (Cloudflare Workers)');
      return drizzle(cfEnv.DB, { schema, casing: 'snake_case' });
    }
  }

  // 3. Local development: use @libsql/client with proper SQLite file
  console.log('[getDb] Using @libsql/client for local development');

  const possiblePaths = [
    process.cwd() + '/.wrangler/state/v3/d1/timorlist-db.actual.sqlite',
    '/home/jasonwill/dev-projects/timorlist/.wrangler/state/v3/d1/timorlist-db.actual.sqlite',
    // Fallback to migration file (wrangler backup)
    process.cwd() + '/.wrangler/state/v3/d1/timorlist-db.sqlite',
    '/home/jasonwill/dev-projects/timorlist/.wrangler/state/v3/d1/timorlist-db.sqlite',
  ];

  for (const dbPath of possiblePaths) {
    try {
      console.log('[getDb] Trying:', dbPath);
      const client = createClient({ url: `file://${dbPath}` });
      // Test connection
      await client.execute('SELECT 1');
      console.log('[getDb] Connected to:', dbPath);
      return drizzleLibsql(client, { schema, casing: 'snake_case' });
    } catch (e) {
      console.log('[getDb] Failed:', e instanceof Error ? e.message.substring(0, 100) : String(e));
    }
  }

  throw new Error('D1 not available. Run: npm run db:setup-local');
}

// Legacy sync export - DO NOT USE
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db');
  }
};