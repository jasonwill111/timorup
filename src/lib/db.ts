// Drizzle DB Instance - Local SQLite for development
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const client = createClient({
  url: 'file:local.db',
});

export const db = drizzle(client, { schema });

// For D1 in production (Cloudflare)
export function createDb(d1Binding: any) {
  return drizzle(d1Binding, { schema });
}
