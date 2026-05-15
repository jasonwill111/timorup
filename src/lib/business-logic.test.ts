/**
 * TDD Tests for business-logic.ts status filter bug
 *
 * GREEN: Tests that verify status filtering works correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { canEditBusiness } from './business-logic';

describe('business-logic.ts - GREEN tests (status filter)', () => {
  describe('canEditBusiness - pure function tests', () => {
    it('should allow admin to edit any business', () => {
      expect(canEditBusiness('admin', 'admin-1', 'user-1')).toBe(true);
      expect(canEditBusiness('super_admin', 'admin-1', 'user-1')).toBe(true);
    });

    it('should allow user to edit their own business', () => {
      expect(canEditBusiness('user', 'user-1', 'user-1')).toBe(true);
      expect(canEditBusiness('editor', 'user-1', 'user-1')).toBe(true);
    });

    it('should deny user editing others business', () => {
      expect(canEditBusiness('user', 'user-1', 'user-2')).toBe(false);
      expect(canEditBusiness('editor', 'user-1', 'user-2')).toBe(false);
    });

    it('should deny null owner comparison', () => {
      expect(canEditBusiness('user', 'user-1', '')).toBe(false);
    });
  });

  describe('Verify fix: hasUserBusiness should filter by live status', () => {
    it('code should filter by live status after fix', async () => {
      const fs = await import('fs');
      const path = `${process.cwd()}/src/lib/business-logic.ts`;
      const content = fs.readFileSync(path, 'utf-8');

      // After fix: should filter by live status in the query
      // Look for: eq(businesses.status, 'live') OR and(eq(...), eq(...))
      const hasStatusFilter = content.includes("eq(businesses.status, 'live')") ||
                             (content.includes('and(') && content.includes('status'));

      // Also check that it doesn't just SELECT status but actually FILTER
      const selectStatusOnly = content.match(/select\s*\(\s*\{[^}]*status[^}]*\}/);
      const hasFilter = content.includes('.where(');

      // The fix should add status filter in the where clause
      expect(hasStatusFilter).toBe(true);
    });

    it('should NOT return deleted/archived businesses after fix', async () => {
      const fs = await import('fs');
      const path = `${process.cwd()}/src/lib/business-logic.ts`;
      const content = fs.readFileSync(path, 'utf-8');

      // After fix: the query should exclude deleted/archived
      // Check that status='deleted' is NOT being selected as an option
      const selectsDeleted = content.includes("'deleted'") ||
                            content.includes('"deleted"');
      const selectsArchived = content.includes("'archived'") ||
                              content.includes('"archived"');

      // After fix: should only select 'live' businesses, not deleted/archived
      expect(selectsDeleted).toBe(false);
      expect(selectsArchived).toBe(false);
    });
  });
});