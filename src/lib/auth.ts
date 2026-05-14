// Better Auth Configuration - Environment Aware
import { betterAuth } from 'better-auth';
import type { BetterAuthInstance } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { getDb } from './db';
import { users, sessions, accounts, verifications } from '@/db/schema';
import { createSessionKVStore } from './auth-kv-store';

// Get OAuth credentials from environment
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const facebookClientId = process.env.FACEBOOK_CLIENT_ID || '';
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || '';

// Check if OAuth is configured
const isGoogleConfigured = !!googleClientId && !!googleClientSecret;
const isFacebookConfigured = !!facebookClientId && !!facebookClientSecret;

// Convert Date objects to Unix timestamps for D1
function convertToTimestamp(value: unknown): number | unknown {
  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }
  if (Array.isArray(value)) {
    return value.map(convertToTimestamp);
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = convertToTimestamp(v);
    }
    return result;
  }
  return value;
}

// Drizzle DB wrapper interface for timestamp conversion
interface DrizzleDbWrapper {
  insert: (table: unknown) => {
    values: (data: unknown) => unknown;
  };
}

// Wrap db to convert Date objects to timestamps before insert
function wrapDbForD1(db: DrizzleDbWrapper): DrizzleDbWrapper {
  if (!db || !db.insert) return db;

  const originalInsert = db.insert.bind(db);
  db.insert = (table: unknown) => {
    const originalQueryBuilder = originalInsert(table);
    const originalValues = originalQueryBuilder.values.bind(originalQueryBuilder);

    originalQueryBuilder.values = (data: unknown) => {
      return originalValues(convertToTimestamp(data));
    };

    return originalQueryBuilder;
  };

  return db;
}

// Factory function to create auth instance with given db and env
export function createAuth(db: DrizzleDbWrapper, env?: { SESSION?: KVNamespace }) {
  // Wrap db to convert Date objects to timestamps for D1
  const wrappedDb = wrapDbForD1(db);

  // Create secondary storage for sessions if KV available
  const secondaryStorage = env?.SESSION
    ? {
        sessions: createSessionKVStore(env.SESSION, 86400), // 24 hour TTL
      }
    : undefined;

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8787',

    database: drizzleAdapter(wrappedDb, {
      provider: 'sqlite',
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),

    // Secondary storage for session caching
    secondaryStorage,

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
      expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes cache for session reads
      },
      // Explicit cookie security configuration
      cookie: {
        name: 'better-auth.session_token',
        httpOnly: true,       // Prevent XSS access to cookie
        secure: import.meta.env.PROD,  // HTTPS only in production
        sameSite: 'strict',     // CSRF protection (strict is stronger than lax)
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds (same as expiresIn)
      },
    },

    // Cache configuration for better-auth 1.6+
    cache: {
      enabled: true,
      maxAge: 60 * 10, // 10 minutes TTL for auth cache
    },

    // Trusted origins - validate APP_URL format, no localhost in production
    trustedOrigins: (() => {
      const origins: string[] = [];
      const appUrl = process.env.APP_URL;
      if (appUrl) {
        try {
          const url = new URL(appUrl);
          // Only add if it's a valid HTTPS URL (not localhost)
          if (url.protocol === 'https:' && !url.hostname.endsWith('.localhost') && url.hostname !== 'localhost') {
            origins.push(appUrl);
          }
        } catch {
          console.warn('[Auth] Invalid APP_URL format:', appUrl);
        }
      }
      return origins;
    })(),

    // Password configuration
    password: {
      minLength: 8,
      maxLength: 100,
    },
  });
}

// Validate AUTH_SECRET at startup (must be >= 32 chars)
const authSecret = process.env.BETTER_AUTH_SECRET;
if (authSecret && authSecret.length < 32) {
  console.error('[Auth] FATAL: BETTER_AUTH_SECRET must be at least 32 characters. Current length:', authSecret.length);
  throw new Error('BETTER_AUTH_SECRET must be at least 32 characters');
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

// Module-level promise to prevent race condition in concurrent requests
let _initAuth: BetterAuthInstance | undefined;
let initPromise: Promise<BetterAuthInstance> | undefined;

// Initialize auth for current environment (cached)
// Uses module-level promise pattern to prevent race condition
export async function initAuth(env?: { SESSION?: KVNamespace }) {
  if (!_initAuth) {
    initPromise ??= (async () => {
      const db = await getDb();
      return createAuth(db, env);
    })();
    _initAuth = await initPromise;
  }
  return _initAuth;
}

// Sync auth object after initAuth is called
export async function getAuth(env?: { SESSION?: KVNamespace }) {
  return initAuth(env);
}

// Export OAuth status for UI
export const oauthStatus = {
  google: isGoogleConfigured,
  facebook: isFacebookConfigured,
};