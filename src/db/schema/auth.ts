// Database schema for Better Auth
import { sqliteTable, text, integer, customType } from 'drizzle-orm/sqlite-core';

// Custom timestamp type that handles Date -> Unix timestamp conversion for D1
const timestamp = () => customType<{ data: number; notNull: false; hasDefault: true }>({
  dataType: () => 'integer',
  toDriver: (value: Date | number | null) => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return Math.floor(value.getTime() / 1000);
    return typeof value === 'number' ? value : null;
  },
  fromDriver: (value: number | null) => value,
});

// Sessions table - D1 compatible with custom timestamp handling
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp()(),
  updatedAt: timestamp()(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull(),
});

// Accounts table (OAuth)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at'),
  refreshTokenExpiresAt: integer('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp()(),
  updatedAt: timestamp()(),
});

// Verifications table
export const verifications = sqliteTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at').notNull(),
  createdAt: timestamp()(),
});

// Export types
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
