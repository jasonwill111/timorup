// Better Auth Configuration - Environment Aware
import { betterAuth, BetterAuthInstance } from 'better-auth';
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
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4321',

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
      'http://localhost:4321',
      process.env.APP_URL || '',
    ].filter(Boolean),

    // Password configuration
    password: {
      minLength: 8,
      maxLength: 100,
    },
  });
}

// Default auth instance (uses local db for backwards compatibility)
let _auth: BetterAuthInstance | null = null;

export function getAuth() {
  if (!_auth) {
    // This will use local db - call initAuth() for Workers
    _auth = createAuth(require('./db').db);
  }
  return _auth;
}

// Initialize auth for current environment
export async function initAuth() {
  const db = await getDb();
  return createAuth(db);
}

// Legacy export (for backwards compatibility)
export const auth = getAuth();

// Export OAuth status for UI
export const oauthStatus = {
  google: isGoogleConfigured,
  facebook: isFacebookConfigured,
};

// Export types
export type Session = Awaited<ReturnType<typeof getAuth>>.$Infer.Session.session;
export type User = Awaited<ReturnType<typeof getAuth>>.$Infer.Session.user;
