/**
 * Database Adapter Interface
 * Enables test mocking and alternate DB implementations
 */
import type { Auth, BetterAuthOptions, Session } from 'better-auth';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

// Drizzle table type for schema inference
export type AnyDrizzleTable = ReturnType<typeof import('drizzle-orm/sqlite-core').sqliteTable>;

// Base interface for Drizzle queries
export interface DatabaseAdapter {
  select(): DatabaseSelectBuilder;
  insert<T extends AnyDrizzleTable>(table: T): DatabaseInsertBuilder<T>;
  update<T extends AnyDrizzleTable>(table: T): DatabaseUpdateBuilder<T>;
  delete<T extends AnyDrizzleTable>(table: T): DatabaseDeleteBuilder<T>;
  run(sql: string, params?: unknown[]): Promise<void>;
}

// Query builders (simplified - full implementation would mirror Drizzle)
export interface DatabaseSelectBuilder {
  from<T extends AnyDrizzleTable>(table: T): DatabaseSelectFromBuilder<T>;
  all(): Promise<unknown[]>;
  get(): Promise<unknown | undefined>;
}

export interface DatabaseSelectFromBuilder<T extends AnyDrizzleTable> {
  where(condition: unknown): this;
  orderBy(...columns: unknown[]): this;
  limit(n: number): this;
  returning(): { get(): Promise<unknown> };
}

export interface DatabaseInsertBuilder<T extends AnyDrizzleTable> {
  values(values: unknown): { run(): Promise<void> };
}

export interface DatabaseUpdateBuilder<T extends AnyDrizzleTable> {
  set(values: unknown): DatabaseUpdateSetBuilder<T>;
}

export interface DatabaseUpdateSetBuilder<T extends AnyDrizzleTable> {
  where(condition: unknown): { returning(): { get(): Promise<unknown> }; run(): Promise<void> };
}

export interface DatabaseDeleteBuilder<T extends AnyDrizzleTable> {
  where(condition: unknown): { run(): Promise<void> };
}

// Auth adapter interface
export interface AuthAdapter {
  createUser(data: {
    email: string;
    emailVerified?: boolean;
    name?: string;
    image?: string;
    phone?: string;
  }): Promise<{ id: string; email: string; emailVerified: boolean; name: string; image: string | null; phone: string | null }>;

  getUserByEmail(email: string): Promise<{ id: string; email: string; emailVerified: boolean; name: string; image: string | null; phone: string | null } | null>;

  getUserById(id: string): Promise<{ id: string; email: string; emailVerified: boolean; name: string; image: string | null; phone: string | null } | null>;

  updateUser(id: string, data: Partial<{ name: string; email: string; image: string; phone: string; emailVerified: boolean }>): Promise<unknown>;

  deleteUser(id: string): Promise<void>;

  createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<{ id: string; userId: string; token: string; expiresAt: number; userAgent: string | null; ipAddress: string | null; createdAt: number; updatedAt: number }>;

  getSession(token: string): Promise<Session | null>;

  deleteSession(token: string): Promise<void>;

  deleteUserSessions(userId: string): Promise<void>;

  listSessions(userId: string): Promise<Session[]>;
}

// Factory function types
export type DatabaseAdapterFactory = (env: unknown) => DatabaseAdapter;
export type AuthAdapterFactory = (config: { database: unknown }, options?: BetterAuthOptions) => AuthAdapter;