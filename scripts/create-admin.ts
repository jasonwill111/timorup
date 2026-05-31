/**
 * Script to create admin user and set password
 * Run: npx wrangler d1 execute timorup-db --remote --command="$(cat create-admin.sql)" --experimental-localize-D1
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/d1';
import { D1Database } from '@cloudflare/workers-types';

// Admin credentials
const ADMIN_EMAIL = 'admin@timorup.com';
const ADMIN_PASSWORD = 'Timorup123!';
const ADMIN_NAME = 'Admin User';

export async function createAdminUser(env) {
  const auth = betterAuth({
    database: drizzleAdapter(env.DB, {
      provider: 'sqlite',
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  });

  // Create user with password
  const result = await auth.api.signUp({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
  });

  return result;
}

// For CLI execution
if (typeof process !== 'undefined') {
  console.log('This script needs to be run via wrangler');
  console.log('Use the admin registration page in the browser instead');
}