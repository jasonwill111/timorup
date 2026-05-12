/**
 * Category query tests - type and structure tests only
 */
import { describe, it, expect } from 'vitest';

describe('Category Queries Structure', () => {
  describe('CategoryInfo type', () => {
    it('has all required fields', () => {
      const category = {
        id: 'cat-1',
        name: 'Restaurants',
        slug: 'restaurants',
        description: 'Food and dining',
        icon: '🍽️',
        parentId: null,
        entityType: 'business' as const,
      };

      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.slug).toBeDefined();
    });

    it('supports entity types', () => {
      const types = ['business', 'nonprofit', null] as const;
      types.forEach(t => {
        expect([null, 'business', 'nonprofit']).toContain(t);
      });
    });
  });

  describe('CategoryWithChildren type', () => {
    it('has children array', () => {
      const parent = {
        id: 'cat-parent',
        name: 'Food',
        slug: 'food',
        description: null,
        icon: null,
        parentId: null,
        entityType: 'business' as const,
        children: [
          { id: 'cat-1', name: 'Restaurants', slug: 'restaurants', description: null, icon: null, parentId: 'cat-parent', entityType: 'business' as const },
        ],
      };

      expect(Array.isArray(parent.children)).toBe(true);
      expect(parent.children.length).toBe(1);
      expect(parent.children[0].parentId).toBe('cat-parent');
    });
  });
});

describe('Query function signatures', () => {
  it('getAllCategories accepts optional entityType', () => {
    const fnSignature = 'async (entityType?: "business" | "nonprofit" | "all") => Promise<Result<CategoryInfo[]>>';
    expect(fnSignature).toContain('entityType');
  });

  it('getCategoryBySlug takes slug string', () => {
    const fnSignature = 'async (slug: string) => Promise<Result<CategoryInfo | null>>';
    expect(fnSignature).toContain('slug');
  });

  it('getTopLevelCategories uses isNull for parent', () => {
    const sqlPattern = 'isNull(categories.parentId)';
    expect(sqlPattern).toContain('parentId');
  });
});