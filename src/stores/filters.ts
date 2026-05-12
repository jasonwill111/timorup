/**
 * Filter Store - Nanostores
 * 统一客户端筛选状态，替代散落的 filter 状态管理
 */
import { atom } from 'nanostores';

// Entity type filter (business | nonprofit | all)
export type EntityType = 'all' | 'business' | 'nonprofit';

export const $entityType = atom<EntityType>('all');

// Category filter
export const $categorySlug = atom<string | null>(null);

// Search term
export const $searchTerm = atom<string>('');

// Sort option
export type SortOption = 'recent' | 'popular' | 'alphabetical';
export const $sortBy = atom<SortOption>('recent');

// Pagination
export const $currentPage = atom<number>(1);

// Setters
export function setEntityType(type: EntityType) {
  $entityType.set(type);
  $currentPage.set(1); // Reset pagination
}

export function setCategory(slug: string | null) {
  $categorySlug.set(slug);
  $currentPage.set(1);
}

export function setSearchTerm(term: string) {
  $searchTerm.set(term);
  $currentPage.set(1);
}

export function setSortBy(sort: SortOption) {
  $sortBy.set(sort);
  $currentPage.set(1);
}

export function setPage(page: number) {
  $currentPage.set(page);
}

// Reset all filters
export function resetFilters() {
  $entityType.set('all');
  $categorySlug.set(null);
  $searchTerm.set('');
  $sortBy.set('recent');
  $currentPage.set(1);
}

// Get current filter state as URL params
export function getFilterParams(): URLSearchParams {
  const params = new URLSearchParams();

  const entityType = $entityType.get();
  if (entityType !== 'all') params.set('type', entityType);

  const category = $categorySlug.get();
  if (category) params.set('category', category);

  const search = $searchTerm.get();
  if (search) params.set('q', search);

  const sort = $sortBy.get();
  if (sort !== 'recent') params.set('sort', sort);

  const page = $currentPage.get();
  if (page > 1) params.set('page', String(page));

  return params;
}