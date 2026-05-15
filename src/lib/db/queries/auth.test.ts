/**
 * TDD Tests for auth.ts expiry handling
 *
 * RED: Tests that expose the SQL expiry comparison bug
 * GREEN: Tests that verify JS-side expiry check works correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuthenticatedUser } from './auth';

// Mock db - simpler chain that works with drizzle
const mockSessionResult = {
  id: 'session-1',
  token: 'valid-token',
  userId: 'user-1',
  expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now (seconds)
};

const mockUserResult = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};

const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  get: vi.fn(),
};

vi.mock('@/lib/db', () => ({
  getDb: vi.fn(() => mockDb),
}));

describe('auth.ts - TDD tests (expiry handling)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mock behavior
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.get.mockReset();
  });

  describe('Verify fix: expiry handling', () => {
    it('code should NOT use gt() in SQL after fix', async () => {
      const fs = await import('fs');
      const authPath = `${process.cwd()}/src/lib/db/queries/auth.ts`;
      const content = fs.readFileSync(authPath, 'utf-8');

      // After fix: should NOT have gt() in SQL where clause
      const usesGtInSQL = content.includes('gt(sessions.expiresAt, new Date())');
      const checksExpiryInJS = content.includes('isSessionExpired');

      expect(usesGtInSQL).toBe(false); // gt() removed from SQL
      expect(checksExpiryInJS).toBe(true); // expiry check in JS
    });
  });

  describe('GREEN: Fixed code should check expiry in JS', () => {
    it('should accept valid session with future expiry', async () => {
      // Arrange - valid session with future timestamp
      const futureSeconds = Math.floor(Date.now() / 1000) + 3600;
      mockDb.get.mockResolvedValueOnce({
        ...mockSessionResult,
        expiresAt: futureSeconds,
      });
      mockDb.get.mockResolvedValueOnce(mockUserResult);

      // Act
      const result = await getAuthenticatedUser('valid-token');

      // Assert - should succeed
      expect(result).toHaveProperty('userId');
      expect(result.userId).toBe('user-1');
    });

    it('should reject expired session', async () => {
      // Arrange - expired session (1 hour ago)
      const expiredSeconds = Math.floor(Date.now() / 1000) - 3600;
      mockDb.get.mockResolvedValueOnce({
        ...mockSessionResult,
        expiresAt: expiredSeconds,
        token: 'expired-token',
      });
      // Second query for users should NOT be called if session is expired
      mockDb.get.mockResolvedValueOnce(null);

      // Act
      const result = await getAuthenticatedUser('expired-token');

      // Assert - should reject
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('SESSION_EXPIRED');
    });

    it('should handle null cookie', async () => {
      // Act
      const result = await getAuthenticatedUser(null);

      // Assert
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('UNAUTHORIZED');
    });

    it('should handle session not found', async () => {
      // Arrange
      mockDb.get.mockResolvedValueOnce(null);

      // Act
      const result = await getAuthenticatedUser('invalid-token');

      // Assert
      expect(result).toHaveProperty('error');
      expect(result.error).toBe('SESSION_EXPIRED');
    });
  });

  describe('Verify fix: code should NOT use gt() in SQL', () => {
    it('after fix, code should check expiry in JS, not SQL', async () => {
      const fs = await import('fs');
      const authPath = `${process.cwd()}/src/lib/db/queries/auth.ts`;
      const content = fs.readFileSync(authPath, 'utf-8');

      // After fix: should NOT have gt() in SQL where clause
      // Should only have: eq(sessions.token, token)
      // Then check expiry in JS with isSessionExpired()

      const usesGtInSQL = content.includes('gt(sessions.expiresAt, new Date())');
      const checksExpiryInJS = content.includes('isSessionExpired') ||
                               content.includes('expiresAtMs');

      // Both assertions should pass after fix
      expect(usesGtInSQL).toBe(false); // gt() removed from SQL
      expect(checksExpiryInJS).toBe(true); // expiry check in JS
    });
  });
});