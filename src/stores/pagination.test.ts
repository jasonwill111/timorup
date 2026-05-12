/**
 * Pagination store tests
 */
import { describe, it, expect } from 'vitest';
import { $pagination, setPage, nextPage, prevPage, setLimit, setTotal, resetPagination, $totalPages, $hasNextPage, $hasPrevPage, $currentRange } from './pagination';

describe('Pagination Store', () => {
  // Reset before each test
  beforeEach(() => {
    resetPagination();
  });

  describe('initial state', () => {
    it('has page 1', () => {
      expect($pagination.get().page).toBe(1);
    });

    it('has limit 12', () => {
      expect($pagination.get().limit).toBe(12);
    });

    it('has total 0', () => {
      expect($pagination.get().total).toBe(0);
    });
  });

  describe('setPage', () => {
    it('can set page to 2', () => {
      setPage(2);
      expect($pagination.get().page).toBe(2);
    });

    it('clamps page below 1', () => {
      setPage(-5);
      expect($pagination.get().page).toBe(1);
    });
  });

  describe('nextPage', () => {
    it('increments page when there are more pages', () => {
      setTotal(50);
      setLimit(10);
      setPage(1);
      nextPage();
      expect($pagination.get().page).toBe(2);
    });
  });

  describe('prevPage', () => {
    it('decrements page when not on first page', () => {
      setPage(2);
      prevPage();
      expect($pagination.get().page).toBe(1);
    });
  });

  describe('setLimit', () => {
    it('changes limit and resets page', () => {
      setPage(3);
      setLimit(20);
      expect($pagination.get().limit).toBe(20);
      expect($pagination.get().page).toBe(1);
    });
  });

  describe('setTotal', () => {
    it('updates total', () => {
      setTotal(100);
      expect($pagination.get().total).toBe(100);
    });
  });

  describe('resetPagination', () => {
    it('resets to default values', () => {
      setPage(5);
      setTotal(100);
      resetPagination();
      expect($pagination.get().page).toBe(1);
      expect($pagination.get().total).toBe(0);
    });
  });

  describe('computed stores', () => {
    it('$totalPages calculates correctly', () => {
      setTotal(50);
      setLimit(10);
      expect($totalPages.get()).toBe(5);
    });

    it('$totalPages is 0 when no results', () => {
      setTotal(0);
      expect($totalPages.get()).toBe(0);
    });

    it('$hasNextPage is true when more pages', () => {
      setTotal(50);
      setLimit(10);
      setPage(1);
      expect($hasNextPage.get()).toBe(true);
    });

    it('$hasPrevPage is false on first page', () => {
      setPage(1);
      expect($hasPrevPage.get()).toBe(false);
    });
  });
});