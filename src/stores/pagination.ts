/**
 * Pagination Store - Page state management
 * SSR-safe atoms for pagination
 */
import { atom, computed } from 'nanostores';

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Default pagination
const defaultPagination: PaginationState = {
  page: 1,
  limit: 12,
  total: 0,
};

// Main pagination atom
export const $pagination = atom<PaginationState>(defaultPagination);

// Computed: total pages
export const $totalPages = computed($pagination, (p) =>
  p.total > 0 ? Math.ceil(p.total / p.limit) : 0
);

// Computed: has next page
export const $hasNextPage = computed($pagination, (p) => p.page < Math.ceil(p.total / p.limit));

// Computed: has previous page
export const $hasPrevPage = computed($pagination, (p) => p.page > 1);

// Computed: current range (e.g., "1-12 of 45")
export const $currentRange = computed($pagination, (p) => {
  if (p.total === 0) {
    return { start: 0, end: 0 };
  }
  const start = (p.page - 1) * p.limit + 1;
  const end = Math.min(p.page * p.limit, p.total);
  return { start, end };
});

// Helper functions
export function setPage(page: number): void {
  const pagination = $pagination.get() ?? undefined;
  // Guard against limit=0
  if (pagination.limit <= 0) {
    return;
  }
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  $pagination.set({ ...pagination, page: validPage });
}

export function nextPage(): void {
  const pagination = $pagination.get() ?? undefined;
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  if (pagination.page < totalPages) {
    $pagination.set({ ...pagination, page: pagination.page + 1 });
  }
}

export function prevPage(): void {
  const pagination = $pagination.get() ?? undefined;
  if (pagination.page > 1) {
    $pagination.set({ ...pagination, page: pagination.page - 1 });
  }
}

export function setLimit(limit: number): void {
  // Guard against invalid limit
  if (limit <= 0) {
    limit = 12;
  }
  const pagination = $pagination.get() ?? undefined;
  $pagination.set({ ...pagination, limit, page: 1 });
}

export function setTotal(total: number): void {
  const pagination = $pagination.get() ?? undefined;
  $pagination.set({ ...pagination, total });
}

export function resetPagination(): void {
  $pagination.set(defaultPagination);
}

export function goToPage(page: number, total: number, limit: number): void {
  // Guard against invalid limit
  if (limit <= 0) {
    limit = 12;
  }
  const totalPages = Math.ceil(total / limit) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  $pagination.set({ page: validPage, limit, total });
}