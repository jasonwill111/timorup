// Better Auth Configuration - Environment Aware
import { betterAuth } from 'better-auth';
import type { BetterAuthInstance } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from './db';
import { users, sessions, accounts, verifications } from '@/db/schema';

// Get OAuth credentials from environment
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const facebookClientId = process.env.FACEBOOK_CLIENT_ID || '';
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || '';

// Check if OAuth is configured
const isGoogleConfigured = !!googleClientId && !!googleClientSecret;
const isFacebookConfigured = !!facebookClientId && !!facebookClientSecret;

// Factory function to create auth instance with given db
export function createAuth(db: any) {
  console.log('[Auth] Creating auth instance');
  console.log('[Auth] DB type:', db?.constructor?.name || typeof db);
  console.log('[Auth] Schema tables:', Object.keys({ user: users, session: sessions, account: accounts, verification: verifications }).join(', '));

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8787',

    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // Social providers - only enable if credentials are configured
    ...(isGoogleConfigured || isFacebookConfigured ? {
      socialProviders: {
        google: isGoogleConfigured ? {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        } : undefined,
        facebook: isFacebookConfigured ? {
          clientId: facebookClientId,
          clientSecret: facebookClientSecret,
        } : undefined,
      },
    } : {}),

    // Session configuration - optimized for performance
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes cache for session reads
      },
    },

    // Cache configuration for better-auth 1.6+
    cache: {
      enabled: true,
      maxAge: 60 * 10, // 10 minutes TTL for auth cache
    },

    // Trusted origins
    trustedOrigins: [
      'http://localhost:8788',
      'http://localhost:8787',
      'http://localhost:4321',
      'http://localhost:4322',
      process.env.APP_URL || '',
    ].filter(Boolean),

    // Password configuration
    password: {
      minLength: 8,
      maxLength: 100,
    },
  });
}

// Default auth instance - lazily initialized via initAuth()
export const auth = {
  api: {
    getSession: async () => ({ user: null, session: null }),
    signInEmail: async () => { throw new Error('Auth not initialized'); },
    signOut: async () => ({}),
    signUpEmail: async () => { throw new Error('Auth not initialized'); },
  }
} as unknown as BetterAuthInstance;

// Initialize auth for current environment (cached)
let _initAuth: BetterAuthInstance | null = null;

export async function initAuth() {
  if (!_initAuth) {
    const db = await getDb();
    console.log('[initAuth] Got DB:', typeof db);
    console.log('[initAuth] DB has insert:', typeof db?.insert);
    console.log('[initAuth] DB has select:', typeof db?.select);
    console.log('[initAuth] DB has query:', typeof db?.query);
    console.log('[initAuth] DB._ type:', typeof db?._);
    console.log('[initAuth] DB.constructor:', db?.constructor?.name);
    _initAuth = createAuth(db);
  }
  return _initAuth;
}

// Sync auth object after initAuth is called
export async function getAuth() {
  return initAuth();
}

// Export OAuth status for UI
export const oauthStatus = {
  google: isGoogleConfigured,
  facebook: isFacebookConfigured,
};