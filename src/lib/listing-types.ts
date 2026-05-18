/**
 * Typed Listing Interfaces
 * Replaces any[] in Astro pages with proper type safety
 */

export interface BaseListing {
  id: string;
  title: string;
  slug: string;
  categoryId: string | null;
  address: string | null;
  tags: string[];
  likes: number;
  saves: number;
  views: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export interface BusinessListing extends BaseListing {
  categoryName: string;
  industryName?: string;
}

export interface NonProfitListing extends BaseListing {
  categoryName: string;
  organizationType?: string;
}

export interface PublicSectorListing extends BaseListing {
  categoryName: string;
  organizationType?: string;
}

export interface ListingItem extends BaseListing {
  listingType?: string;
  price?: number;
  priceUnit?: string;
  location?: string;
}

export interface ProductService {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  priceUnit: string | null;
  categoryName: string;
  businessName: string;
  businessSlug: string;
  createdAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Helper to create empty typed arrays
export function emptyListingArray(): BusinessListing[] {
  return [];
}

export function emptyNonProfitArray(): NonProfitListing[] {
  return [];
}

export function emptyPublicSectorArray(): PublicSectorListing[] {
  return [];
}

export function emptyListingItemArray(): ListingItem[] {
  return [];
}

export function emptyProductServiceArray(): ProductService[] {
  return [];
}