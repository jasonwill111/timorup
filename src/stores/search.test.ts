/**
 * Search store tests
 */
import { describe, it, expect } from 'vitest';
import { $searchQuery, $debouncedSearch, $searchLoading, $searchResultsCount } from './search';

describe('Search Store', () => {
  it('$searchQuery is an atom with empty string initial value', () => {
    expect($searchQuery.get()).toBe('');
  });

  it('$debouncedSearch is an atom with empty string initial value', () => {
    expect($debouncedSearch.get()).toBe('');
  });

  it('$searchLoading is an atom with false initial value', () => {
    expect($searchLoading.get()).toBe(false);
  });

  it('$searchResultsCount is an atom with 0 initial value', () => {
    expect($searchResultsCount.get()).toBe(0);
  });

  it('can set search query', () => {
    $searchQuery.set('pizza');
    expect($searchQuery.get()).toBe('pizza');
  });

  it('can set loading state', () => {
    $searchLoading.set(true);
    expect($searchLoading.get()).toBe(true);
  });

  it('can set results count', () => {
    $searchResultsCount.set(42);
    expect($searchResultsCount.get()).toBe(42);
  });

  it('can set debounced search', () => {
    $debouncedSearch.set('restaurant');
    expect($debouncedSearch.get()).toBe('restaurant');
  });
});