// Drizzle DB Instance - Unified D1/SQLite
// Local: file:local.db (synced with D1 via wrangler)
// Production: D1 binding from Cloudflare Workers

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Local development - use file-based SQLite (synced with D1)
const client = createClient({
  url: 'file:local.db',
});

export const db = drizzle(client, { schema });

// For Cloudflare Workers (production)
export function createDb(d1Binding: D1Database) {
  return drizzle(d1Binding, { schema });
}

// Type for D1 binding
export type D1Database = D1Database;
