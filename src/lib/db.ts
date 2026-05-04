// Drizzle DB Instance - Astro 6 Cloudflare Workers + Local Development
// Workers: drizzle-orm/d1 (Cloudflare D1 binding)
// Local: drizzle-orm/libsql (local SQLite via @libsql/client)

import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
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

// Get local SQLite path (from wrangler state)
function getLocalDbPath(): string {
  // wrangler dev --local creates SQLite at this path
  const stateDir = process.env.WRANGLER_STATE_DIR || '.wrangler/state/v3/d1';
  return `${stateDir}/timorlist-db.sqlite`;
}

// Get D1 database binding
export async function getDb() {
  // 1. Cloudflare Workers runtime: use D1 binding from env
  if (await isWorkersRuntime()) {
    try {
      const { env } = await import('cloudflare:workers');
      const cfEnv = env as { DB?: any };
      if (cfEnv.DB) {
        console.log('[getDb] Using D1 (Workers runtime)');
        return drizzle(cfEnv.DB, { schema, casing: 'snake_case' });
      }
    } catch (e) {
      // fall through to next option
    }
  }

  // 2. Wrangler dev --remote: use Astro globals D1
  if (typeof globalThis !== 'undefined' && (globalThis as any).__ASTRO_ENV?.D1) {
    const d1 = (globalThis as any).__ASTRO_ENV.D1;
    console.log('[getDb] Using D1 (wrangler dev --remote)');
    return drizzle(d1, { schema, casing: 'snake_case' });
  }

  // 3. Local development (Node): use @libsql/client + local SQLite
  if (process.env.USE_CLOUDFLARE !== '1') {
    try {
      const localDbPath = getLocalDbPath();
      console.log('[getDb] Using local SQLite:', localDbPath);

      // Check if local SQLite exists
      const fs = await import('fs');
      if (fs.existsSync(localDbPath)) {
        const client = createClient({ url: `file://${localDbPath}` });
        return drizzleLibsql(client, { schema, casing: 'snake_case' });
      } else {
        console.warn('[getDb] Local SQLite not found at:', localDbPath);
        console.warn('[getDb] Run: pnpm db:setup-local to create it');
      }
    } catch (e) {
      console.error('[getDb] Failed to create local DB:', e);
    }
  }

  throw new Error('[getDb] D1 not available. Use: wrangler dev dist/server/entry.mjs --remote');
}

// Legacy sync export - DO NOT USE
export const db = {
  select: () => {
    throw new Error('Use await getDb() instead of db');
  }
};