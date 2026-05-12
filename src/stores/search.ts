/**
 * Search Store - Client-side search query state
 * SSR-safe atom for search input
 */
import { atom } from 'nanostores';

// Search query string
export const $searchQuery = atom<string>('');

// Debounced search (300ms)
// Note: setTimeout is browser-only; guard ensures SSR safety
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
export const $debouncedSearch = atom<string>('');

export function setSearchQuery(query: string): void {
  $searchQuery.set(query);

  // Guard: only run timers in browser context
  if (typeof setTimeout === 'undefined') {
    $debouncedSearch.set(query);
    return;
  }

  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set debounced value after 300ms
  debounceTimer = setTimeout(() => {
    $debouncedSearch.set(query);
  }, 300);
}

export function clearSearch(): void {
  $searchQuery.set('');
  $debouncedSearch.set('');
  if (debounceTimer && typeof clearTimeout !== 'undefined') {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

// Loading state for search
export const $searchLoading = atom<boolean>(false);

// Search results count
export const $searchResultsCount = atom<number>(0);