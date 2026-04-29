// Drizzle DB Instance
// In Workers: use D1 binding via Astro.locals or cloudflare:workers
// In local dev: use D1 local file (.wrangler/state/v3/d1/)

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

// Create Workers db with D1 binding
export function createWorkersDb(d1Binding: any) {
  return drizzle(d1Binding, { schema });
}

// For local development - use D1 local file
let localDb: ReturnType<typeof drizzle> | null = null;

async function getLocalDb(): Promise<ReturnType<typeof drizzle>> {
  if (!localDb) {
    const { createClient } = await import('@libsql/client');
    // Use D1 local file from wrangler state
    const client = createClient({ url: 'file:.wrangler/state/v3/d1/timorlist-db.sqlite' });
    localDb = drizzle(client, { schema });
  }
  return localDb;
}

// Get db - returns Workers db from locals if available, otherwise local db
export async function getDb(): Promise<ReturnType<typeof drizzle>> {
  // Try Astro.locals first (Workers)
  if (typeof Astro !== 'undefined' && (Astro as any).locals?.db) {
    return (Astro as any).locals.db;
  }

  // Try cloudflare:workers env (Workers)
  try {
    const { env } = await import('cloudflare:workers');
    const cfEnv = env as { DB?: any };
    if (cfEnv.DB) {
      return drizzle(cfEnv.DB, { schema });
    }
  } catch {
    // Not in Workers
  }

  // Fall back to local db (D1 local file)
  return getLocalDb();
}

// Legacy sync export - use getDb() instead
// This will throw in Workers until middleware sets Astro.locals.db
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db. The synchronous db export does not work in Cloudflare Workers.');
  }
};
