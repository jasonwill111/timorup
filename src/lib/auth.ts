// Better Auth Configuration - Environment Aware
import { betterAuth } from 'better-auth';
import type { Auth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
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

// Wrapper that only intercepts insert to convert Date to timestamps
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapDbForD1(db: any): any {
  return new Proxy(db, {
    get(target, prop) {
      if (prop === 'insert') {
        return function(table: unknown) {
          const query = target.insert(table);
          return new Proxy(query, {
            get(qTarget, qProp) {
              if (qProp === 'values') {
                return function(data: unknown) {
                  return qTarget.values.call(qTarget, convertToTimestamp(data));
                };
              }
              // Return method directly without binding - Cloudflare Workers requires native functions to keep their original `this`
              const method = qTarget[qProp];
              if (typeof method === 'function') {
                return method;
              }
              return method;
            }
          });
        };
      }
      const value = target[prop as keyof typeof target];
      // Don't bind native functions - they must keep their original `this` in Cloudflare Workers
      // Binding native functions like fetch, JSON.stringify, etc. causes "Illegal invocation" errors
      if (typeof value === 'function') {
        return value;
      }
      return value;
    }
  });
}

// Type for auth config
export interface AuthConfig {
  db: unknown;
  env?: { SESSION?: KVNamespace };
  baseURL?: string;
}

/**
 * Create Drizzle adapter for Better Auth
 */
export function createDrizzleAuthAdapter(db: unknown) {
  const wrappedDb = wrapDbForD1(db);
  return drizzleAdapter(wrappedDb, {
    provider: 'sqlite',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  });
}

/**
 * Auth Factory - creates Better Auth instances
 */
export function createAuthFactory() {
  return {
    createAuth(config: AuthConfig): Auth {
      const { db, env, baseURL } = config;

      // Wrap db to convert Date objects to timestamps for D1
      const wrappedDb = wrapDbForD1(db);

      // Create auth instance
      return betterAuth({
        baseURL: baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:8787',

        database: drizzleAdapter(wrappedDb, {
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
          expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
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
  };
}

// Module-level singleton (lazy init to avoid startup issues)
let _authInstance: Auth | undefined;
let _initPromise: Promise<Auth> | undefined;

/**
 * Get or create singleton auth instance
 */
export async function getAuthInstance(env?: { SESSION?: KVNamespace }): Promise<Auth> {
  if (!_authInstance) {
    _initPromise ??= (async () => {
      const { getDb } = await import('./db');
      const db = await getDb();
if (!db) throw new Error("Database not available");
      if (!db) {
        throw new Error('[getAuthInstance] Database not available');
      }
      const factory = createAuthFactory();
      return factory.createAuth({ db, env });
    })();
    _authInstance = await _initPromise;
  }
  return _authInstance;
}

// Validate AUTH_SECRET at startup (must be >= 32 chars)
const authSecret = process.env.BETTER_AUTH_SECRET;
if (authSecret && authSecret.length < 32) {
  console.error('[Auth] FATTER_AUTH_SECRET must be at least 32 characters. Current length:', authSecret.length);
  throw new Error('BETTER_AUTH_SECRET must be at least 32 characters');
}

// Singleton auth instance cache
let authInstance: Auth | null = null;

/**
 * Get singleton auth instance (for Server Actions)
 */
export async function initAuth(): Promise<Auth> {
  if (authInstance) return authInstance;

  // Lazy initialization with env check
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    try {
      const cfEnv = (globalThis as unknown as { env: Record<string, unknown> }).env;
      const db = await import('./db').then(m => m.getDb());
      authInstance = createAuthFactory().createAuth({
        db,
        env: cfEnv as { SESSION?: KVNamespace; [key: string]: unknown },
        baseURL: process.env.APP_URL || process.env.BETTER_AUTH_URL || 'http://localhost:8787',
      });
      return authInstance;
    } catch (e) {
      console.warn('[Auth] initAuth failed:', e);
    }
  }

  throw new Error('Auth not available');
}

// Export OAuth status for UI
export const oauthStatus = {
  google: isGoogleConfigured,
  facebook: isFacebookConfigured,
};

// Re-export types
export type { Auth } from 'better-auth';