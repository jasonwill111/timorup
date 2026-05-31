// Lightweight Auth Action - Bypasses better-auth for Free Plan compatibility
// Uses direct D1 queries to stay under 10ms CPU limit
import { defineAction } from 'astro:actions';
import * as z from 'zod';
import { createErrorResponse } from '@/lib/errors';
import { ErrorCode } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rate-limit';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcryptjs';
import { env } from 'cloudflare:workers';

// Session constants
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

const emailSchema = z.string().email({ error: 'Valid email required' });

/**
 * Simplified sign-in using direct D1 queries
 * Avoids better-auth overhead to stay under 10ms CPU limit
 */
export const lightSignIn = defineAction({
  accept: 'json',
  input: z.object({
    email: emailSchema,
    password: z.string().min(8),
    rememberMe: z.boolean().optional().default(false),
  }),
  handler: async (input) => {
    // Rate limit check (in-memory, fast)
    const rateLimit = checkRateLimit('auth-sign-in');
    if (!rateLimit.allowed) {
      return createErrorResponse(
        ErrorCode.AUTH_RATE_LIMITED,
        'Too many attempts. Please try again later.'
      );
    }

    try {
      const db = env.DB as D1Database;
      if (!db) {
        return createErrorResponse(ErrorCode.SERVER_ERROR, 'Database unavailable');
      }

      // Direct D1 query for user
      const userResult = await db
        .prepare('SELECT id, email, name, role FROM user WHERE email = ?')
        .bind(input.email.toLowerCase())
        .first();

      if (!userResult) {
        return createErrorResponse(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');
      }

      // Direct D1 query for account (contains password hash)
      const accountResult = await db
        .prepare('SELECT password FROM account WHERE userId = ? AND providerId = ?')
        .bind(userResult.id, 'email')
        .first();

      if (!accountResult) {
        return createErrorResponse(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');
      }

      // Verify password using bcryptjs (async, Workers-compatible)
      const storedHash = accountResult.password as string;
      const passwordValid = await bcryptCompare(input.password, storedHash);

      if (!passwordValid) {
        return createErrorResponse(ErrorCode.AUTH_INVALID_CREDENTIALS, 'Invalid email or password');
      }

      // Generate session token
      const sessionToken = generateSessionToken();
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

      // Store session in KV
      const kv = env.SESSION as KVNamespace;
      if (kv) {
        await kv.put(
          `session:${sessionToken}`,
          JSON.stringify({ userId: userResult.id, email: userResult.email }),
          { expirationTtl: SESSION_TTL_SECONDS }
        );
      }

      // Store session in database (required by better-auth pattern)
      await db
        .prepare(`
          INSERT INTO session (id, userId, token, expiresAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(sessionToken, userResult.id, sessionToken, expiresAt, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000))
        .run();

      return {
        success: true,
        user: {
          id: userResult.id,
          email: userResult.email,
          name: userResult.name,
          role: userResult.role,
        },
        token: sessionToken,
      };
    } catch (error) {
      console.error('[LightAuth] Sign-in error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Authentication failed');
    }
  },
});

/**
 * Simplified sign-up using direct D1 queries
 */
export const lightSignUp = defineAction({
  accept: 'json',
  input: z.object({
    email: emailSchema,
    password: z.string().min(8),
    name: z.string().min(1),
  }),
  handler: async (input) => {
    // Rate limit check
    const rateLimit = checkRateLimit('auth-sign-up');
    if (!rateLimit.allowed) {
      return createErrorResponse(
        ErrorCode.AUTH_RATE_LIMITED,
        'Too many attempts. Please try again later.'
      );
    }

    try {
      const db = env.DB as D1Database;
      if (!db) {
        return createErrorResponse(ErrorCode.SERVER_ERROR, 'Database unavailable');
      }

      // Check if user exists
      const existingUser = await db
        .prepare('SELECT id FROM user WHERE email = ?')
        .bind(input.email.toLowerCase())
        .first();

      if (existingUser) {
        return createErrorResponse(ErrorCode.AUTH_USER_EXISTS, 'Email already registered');
      }

      // Hash password with bcrypt (10 rounds for speed)
      const passwordHash = await bcryptHash(input.password, 10);
      const userId = generateId();
      const now = Math.floor(Date.now() / 1000);

      // Create user
      await db
        .prepare(`
          INSERT INTO user (id, email, name, role, createdAt, updatedAt, emailVerified)
          VALUES (?, ?, ?, 'user', ?, ?, 1)
        `)
        .bind(userId, input.email.toLowerCase(), input.name, now, now)
        .run();

      // Create account with password
      const accountId = generateId();
      await db
        .prepare(`
          INSERT INTO account (id, userId, accountId, providerId, password, createdAt, updatedAt)
          VALUES (?, ?, ?, 'email', ?, ?, ?)
        `)
        .bind(accountId, userId, userId, passwordHash, now, now)
        .run();

      return {
        success: true,
        user: {
          id: userId,
          email: input.email,
          name: input.name,
          role: 'user',
        },
      };
    } catch (error) {
      console.error('[LightAuth] Sign-up error:', error);
      return createErrorResponse(ErrorCode.SERVER_ERROR, 'Registration failed');
    }
  },
});

// ============== Utility Functions ==============

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(21));
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}
