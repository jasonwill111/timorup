// Better Auth Configuration - Cloudflare Workers Compatible
// Using better-auth-cloudflare for native CF Workers support

import { betterAuth } from 'better-auth';
import type { Auth } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { users, accounts, verifications } from '@/db/schema';

// Type for Cloudflare properties
interface CfProperties {
  colo?: string;
  city?: string;
  country?: string;
  region?: string;
  timezone?: string;
  latitude?: string;
  longitude?: string;
}

// Base URL fallback
const DEFAULT_BASE_URL = 'https://timorup.jasonwill.workers.dev';

/**
 * Create Better Auth instance for Cloudflare Workers
 * Uses withCloudflare for native CF Workers compatibility
 */
export function createAuthInstance(env: Record<string, unknown>, cf?: CfProperties) {
  // Get D1 database binding
  const d1Db = env.DB as D1Database;
  if (!d1Db) {
    throw new Error('[Auth] D1 database binding (DB) not found in env');
  }

  // Get environment variables from env (Cloudflare Workers bindings)
  const googleClientId = (env.GOOGLE_CLIENT_ID as string) || '';
  const googleClientSecret = (env.GOOGLE_CLIENT_SECRET as string) || '';
  const facebookClientId = (env.FACEBOOK_CLIENT_ID as string) || '';
  const facebookClientSecret = (env.FACEBOOK_CLIENT_SECRET as string) || '';

  // Check if OAuth is configured
  const isGoogleConfigured = !!googleClientId && !!googleClientSecret;
  const isFacebookConfigured = !!facebookClientId && !!facebookClientSecret;

  // Validate AUTH_SECRET (optional - better-auth handles missing secret)
  const authSecret = (env.BETTER_AUTH_SECRET as string) || '';
  if (authSecret && authSecret.length < 32) {
    console.error('[Auth] BETTER_AUTH_SECRET must be at least 32 characters. Current length:', authSecret.length);
  }

  // Get base URL from env or use default
  const baseURL = (env.APP_URL as string) || (env.BETTER_AUTH_URL as string) || DEFAULT_BASE_URL;

  // Create Drizzle instance WITHOUT sessions table - better-auth uses KV only
  const db = drizzle(d1Db, {
    schema: {
      users,
      accounts,
      verifications
    }
  });

  // Configure social providers if available
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> | undefined =
    (isGoogleConfigured || isFacebookConfigured)
      ? {
          ...(isGoogleConfigured ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } } : {}),
          ...(isFacebookConfigured ? { facebook: { clientId: facebookClientId, clientSecret: facebookClientSecret } } : {}),
        }
      : undefined;

  // Use withCloudflare for native CF Workers compatibility
  const authConfig = withCloudflare(
    {
      // Cloudflare specific options
      d1: {
        db,  // Drizzle instance with schema
        options: {
          schema: {
            user: users,
            account: accounts,
            verification: verifications,
          },
          usePlural: false,
        }
      },
      // KV for sessions - store sessions in KV instead of D1
      kv: env.SESSION,
      // Disable geolocation and IP detection
      geolocationTracking: false,
      autoDetectIpAddress: false,
    },
    {
      // Standard better-auth options
      baseURL,
      database: undefined,  // Set by withCloudflare
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      ...(socialProviders ? { socialProviders } : {}),
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        storeSessionInDatabase: false,  // Use KV for sessions
      },
      // Disable cache to ensure fresh reads
      cache: undefined,
      trustedOrigins: (() => {
        const origins: string[] = [];
        const appUrl = baseURL;
        if (appUrl) {
          try {
            const url = new URL(appUrl);
            if (url.protocol === 'https:' && !url.hostname.endsWith('.localhost') && url.hostname !== 'localhost') {
              origins.push(appUrl);
            }
          } catch {
            console.warn('[Auth] Invalid APP_URL format:', appUrl);
          }
        }
        return origins;
      })(),
      password: {
        minLength: 8,
        maxLength: 100,
      },
    }
  );

  return betterAuth(authConfig);
}

// Singleton auth instance cache - global to survive multiple requests
let authInstance: Auth | null = null;
let cachedEnvKeys: string = '';

/**
 * Initialize and cache auth instance
 * Uses global singleton to avoid reinitializing on each request
 */
export function initAuthInstance(
  env: Record<string, unknown>,
  _cf?: CfProperties
): Auth {
  // Create a key from env binding names to detect env changes
  const envKeys = Object.keys(env).sort().join(',');

  // Return cached instance if env hasn't changed
  if (authInstance && cachedEnvKeys === envKeys) {
    return authInstance;
  }

  authInstance = createAuthInstance(env, _cf);
  cachedEnvKeys = envKeys;
  console.log('[Auth] Created new auth instance');

  return authInstance;
}

/**
 * Get auth instance (for use in API routes)
 * Uses cloudflare:workers for env access
 */
export async function getAuth(): Promise<Auth> {
  if (authInstance) {
    return authInstance;
  }

  // Get env from cloudflare:workers
  let env: Record<string, unknown> | undefined;

  // Try cloudflare:workers dynamic import
  try {
    const { env: workersEnv } = await import('cloudflare:workers');
    if (workersEnv && typeof workersEnv === 'object' && Object.keys(workersEnv).length > 0) {
      env = workersEnv as Record<string, unknown>;
    }
  } catch {
    // Not in CF environment
  }

  // Fallback to globalThis
  if (!env && typeof globalThis !== 'undefined' && 'env' in globalThis) {
    env = (globalThis as unknown as { env: Record<string, unknown> }).env;
  }

  if (!env || Object.keys(env).length === 0) {
    throw new Error('[Auth] No env available');
  }

  return initAuthInstance(env);
}

/**
 * Create auth handler for API routes
 * Use in API endpoints like /api/auth/[...all].ts
 */
export function createAuthHandler() {
  return {
    handler: async (request: Request, env: Record<string, unknown>, cf?: CfProperties) => {
      const auth = initAuthInstance(env, cf);
      return auth.api.handler(request);
    }
  };
}

// Export OAuth status for UI (lazy-loaded)
export function getOauthStatus(): { google: boolean; facebook: boolean } {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    const env = (globalThis as unknown as { env: Record<string, unknown> }).env;
    if (env) {
      const googleId = (env.GOOGLE_CLIENT_ID as string) || '';
      const googleSecret = (env.GOOGLE_CLIENT_SECRET as string) || '';
      const fbId = (env.FACEBOOK_CLIENT_ID as string) || '';
      const fbSecret = (env.FACEBOOK_CLIENT_SECRET as string) || '';
      return {
        google: !!googleId && !!googleSecret,
        facebook: !!fbId && !!fbSecret,
      };
    }
  }
  return { google: false, facebook: false };
}

// Re-export types
export type { Auth } from 'better-auth';

// Re-export initAuth for server actions
export { initAuthInstance as initAuth };
