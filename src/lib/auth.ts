// Better Auth Configuration
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { users, sessions, accounts, verifications } from '@/db/schema';

// Get OAuth credentials from environment
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const facebookClientId = process.env.FACEBOOK_CLIENT_ID || '';
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET || '';

// Check if OAuth is configured
const isGoogleConfigured = !!googleClientId && !!googleClientSecret;
const isFacebookConfigured = !!facebookClientId && !!facebookClientSecret;

export const auth = betterAuth({
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
    requireEmailVerification: false, // Set to true in production
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
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
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

// Export OAuth status for UI
export const oauthStatus = {
  google: isGoogleConfigured,
  facebook: isFacebookConfigured,
};

// Export types
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
