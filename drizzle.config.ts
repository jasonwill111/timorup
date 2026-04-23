import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: 'file:local.db',
  },
  // Use wrangler d1 for migrations
  migrationsProvider: undefined,
});
