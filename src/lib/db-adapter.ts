/**
 * Cloudflare D1 Adapter
 * Implements DatabaseAdapter for Cloudflare Workers D1
 */
import type { DatabaseAdapter } from './adapters';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/db/schema';

export interface D1AdapterConfig {
  database: D1Database;
}

/**
 * Create a D1 adapter for Cloudflare Workers
 */
export function createD1Adapter(config: D1AdapterConfig): DrizzleD1Database<typeof schema> {
  return drizzle(config.database, { schema });
}

/**
 * Get database from cloudflare:workers env
 */
export async function getDbFromEnv(): Promise<DrizzleD1Database<typeof schema> | null> {
  try {
    const { env } = await import('cloudflare:workers');
    if (env.DB) {
      return drizzle(env.DB as D1Database, { schema });
    }
  } catch {
    // cloudflare:workers not available
  }
  return null;
}