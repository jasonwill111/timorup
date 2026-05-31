// Database schema for Better Auth - matching better-auth's expected column names (camelCase)
// Reference: https://www.better-auth.com/docs/database-adapters/drizzle

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// Sessions table - matches better-auth's expected schema
export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt').default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updatedAt').default(Math.floor(Date.now() / 1000)),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull(),
}, (t) => ({
  userIdx: index('sessions_user_idx').on(t.userId),
  tokenIdx: index('sessions_token_idx').on(t.token),
}));

// Accounts table (OAuth + password) - matches better-auth's expected schema
export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt'),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('createdAt').default(Math.floor(Date.now() / 1000)),
  updatedAt: integer('updatedAt').default(Math.floor(Date.now() / 1000)),
}, (t) => ({
  userIdx: index('accounts_user_idx').on(t.userId),
}));

// Verifications table - matches better-auth's expected schema
export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt').notNull(),
  createdAt: integer('createdAt').default(Math.floor(Date.now() / 1000)),
}, (t) => ({
  expiresIdx: index('verifications_expires_idx').on(t.expiresAt),
}));

// Export types
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;