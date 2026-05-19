import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/db/schema';
import { D1Database } from '@cloudflare/workers-types';

// Path to local D1 database
const DB_PATH = './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/b35dc1252703368fd322588b14dfdbedf063db1b9844683bfee80e94dd327afa.sqlite';

async function seed() {
  // @ts-ignore - Local file access for Drizzle
  const db = drizzle({ schema });

  console.log('Seed script ready. Run with:');
  console.log('  npx wrangler d1 execute TimorLink-db --local --command "SELECT 1"');
  console.log('Then manually import data using wrangler d1 execute');
}

seed();

