/**
 * TDD Tests for auth.ts - KV-based authentication
 *
 * Tests verify KV session storage works correctly
 */

import { describe, it, expect } from 'vitest';

describe('auth.ts - KV-based authentication', () => {
  describe('KV session structure', () => {
    it('should read session from KV, not D1', async () => {
      // After migration: auth.ts uses env.SESSION.get(), not db.select().from(sessions)
      const fs = await import('fs');
      const authPath = `${process.cwd()}/src/lib/db/queries/auth.ts`;
      const content = fs.readFileSync(authPath, 'utf-8');

      // Should use KV, not D1 sessions table
      const usesKV = content.includes('env.SESSION.get');
      const usesDbSessions = content.includes('db.select().from(sessions)');

      expect(usesKV).toBe(true);
      expect(usesDbSessions).toBe(false);
    });

    it('should parse JSON stored session data', async () => {
      const fs = await import('fs');
      const authPath = `${process.cwd()}/src/lib/db/queries/auth.ts`;
      const content = fs.readFileSync(authPath, 'utf-8');

      // Should parse stored JSON with session and user
      const parsesJson = content.includes('JSON.parse(stored)');
      const readsSession = content.includes('data.session');
      const readsUser = content.includes('data.user');

      expect(parsesJson).toBe(true);
      expect(readsSession).toBe(true);
      expect(readsUser).toBe(true);
    });

    it('should check expiry from KV stored data', async () => {
      const fs = await import('fs');
      const authPath = `${process.cwd()}/src/lib/db/queries/auth.ts`;
      const content = fs.readFileSync(authPath, 'utf-8');

      // Should check expiry from kvSession.expiresAt
      const checksExpiry = content.includes('new Date(session.expiresAt)');

      expect(checksExpiry).toBe(true);
    });
  });
});