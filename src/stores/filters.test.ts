/**
 * Filters store tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { $entityType, $categorySlug, $searchTerm, $sortBy, $currentPage, setEntityType, setCategory, setSearchTerm, setSortBy, setPage, resetFilters } from './filters';

describe('Filters Store', () => {
  beforeEach(() => {
    resetFilters();
  });

  describe('initial state', () => {
    it('entityType defaults to all', () => {
      expect($entityType.get()).toBe('all');
    });

    it('categorySlug is null', () => {
      expect($categorySlug.get()).toBeNull();
    });

    it('searchTerm is empty', () => {
      expect($searchTerm.get()).toBe('');
    });

    it('sortBy defaults to recent', () => {
      expect($sortBy.get()).toBe('recent');
    });

    it('currentPage is 1', () => {
      expect($currentPage.get()).toBe(1);
    });
  });

  describe('setEntityType', () => {
    it('sets business', () => {
      setEntityType('business');
      expect($entityType.get()).toBe('business');
    });

    it('sets nonprofit', () => {
      setEntityType('nonprofit');
      expect($entityType.get()).toBe('nonprofit');
    });

    it('resets page to 1', () => {
      setPage(5);
      setEntityType('business');
      expect($currentPage.get()).toBe(1);
    });
  });

  describe('setCategory', () => {
    it('sets category slug', () => {
      setCategory('restaurants');
      expect($categorySlug.get()).toBe('restaurants');
    });

    it('can set to null', () => {
      setCategory('restaurants');
      setCategory(null);
      expect($categorySlug.get()).toBeNull();
    });

    it('resets page to 1', () => {
      setPage(5);
      setCategory('restaurants');
      expect($currentPage.get()).toBe(1);
    });
  });

  describe('setSearchTerm', () => {
    it('sets search term', () => {
      setSearchTerm('pizza');
      expect($searchTerm.get()).toBe('pizza');
    });

    it('resets page to 1', () => {
      setPage(5);
      setSearchTerm('pizza');
      expect($currentPage.get()).toBe(1);
    });
  });

  describe('setSortBy', () => {
    it('sets sort option', () => {
      setSortBy('popular');
      expect($sortBy.get()).toBe('popular');
    });

    it('resets page to 1', () => {
      setPage(5);
      setSortBy('alphabetical');
      expect($currentPage.get()).toBe(1);
    });
  });

  describe('setPage', () => {
    it('sets current page', () => {
      setPage(3);
      expect($currentPage.get()).toBe(3);
    });
  });

  describe('resetFilters', () => {
    it('resets all filters to defaults', () => {
      setEntityType('business');
      setCategory('restaurants');
      setSearchTerm('pizza');
      setSortBy('popular');
      setPage(5);

      resetFilters();

      expect($entityType.get()).toBe('all');
      expect($categorySlug.get()).toBeNull();
      expect($searchTerm.get()).toBe('');
      expect($sortBy.get()).toBe('recent');
      expect($currentPage.get()).toBe(1);
    });
  });
});