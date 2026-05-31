// Better Auth Configuration - Cloudflare Workers Compatible
// Using d1Native for lighter bundle and faster init

import { betterAuth } from 'better-auth';
import type { Auth } from 'better-auth';
import { withCloudflare } from 'better-auth-cloudflare';

let authInstance: Auth | null = null;
let cachedEnvKeys: string = '';

export function createAuthInstance(env: Record<string, unknown>, _cf?: Record<string, unknown>): Auth {
  const d1Db = env.DB as D1Database;

  if (!d1Db) {
    throw new Error('[Auth] D1 database binding (DB) not found in env');
  }

  const baseURL = (env.APP_URL as string) || (env.BETTER_AUTH_URL as string) || 'https://timorup.jasonwill.workers.dev';

  // Use d1Native - Kysely handles schema internally, no drizzle-orm needed
  const authConfig = withCloudflare(
    {
      d1Native: d1Db,
      kv: env.SESSION,
      geolocationTracking: false,
      autoDetectIpAddress: false,
    },
    {
      baseURL,
      database: undefined,
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        storeSessionInDatabase: true,
        cookieConfig: {
          name: 'better-auth.session_token',
          secure: false, // Allow in development
          sameSite: 'lax', // Allow cross-site cookies for development
          httpOnly: true,
          path: '/',
        },
      },
      cache: undefined,
      trustedOrigins: [baseURL, 'http://localhost:4332', 'http://localhost:4323', 'http://localhost:4321', 'http://localhost:4322', 'http://localhost:4325'],
      password: {
        minLength: 8,
        maxLength: 100,
      },
    }
  );
  return betterAuth(authConfig);
}

export function initAuthInstance(env: Record<string, unknown>, cf?: Record<string, unknown>): Auth {
  const envKeys = Object.keys(env).sort().join(',');

  if (authInstance && cachedEnvKeys === envKeys) {
    return authInstance;
  }

  authInstance = createAuthInstance(env, cf);
  cachedEnvKeys = envKeys;

  return authInstance;
}

export async function getAuth(): Promise<Auth> {
  if (authInstance) {
    return authInstance;
  }

  let env: Record<string, unknown> | undefined;
  try {
    const { env: workersEnv } = await import('cloudflare:workers');
    if (workersEnv && typeof workersEnv === 'object' && Object.keys(workersEnv).length > 0) {
      env = workersEnv as Record<string, unknown>;
    }
  } catch {
    env = (globalThis as unknown as { env?: Record<string, unknown> }).env;
  }

  if (!env || Object.keys(env).length === 0) {
    throw new Error('[Auth] No env available');
  }

  return initAuthInstance(env);
}

export function createAuthHandler() {
  return {
    handler: async (request: Request, env: Record<string, unknown>, cf?: Record<string, unknown>) => {
      const auth = initAuthInstance(env, cf);
      return auth.api.handler(request);
    }
  };
}

export type { Auth } from 'better-auth';
export { initAuthInstance as initAuth };