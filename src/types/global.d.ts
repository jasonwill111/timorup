// Global type declarations for Cloudflare Workers + Astro
// This file extends the base Env interface with project-specific bindings

export {};

declare global {
  // Cloudflare Workers environment - extended with project bindings
  interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    SESSION: KVNamespace;
    MEDIA_BUCKET: R2Bucket;
    R2_PUBLIC_URL?: string;
    MINIMAX_API_KEY?: string;
  }
  interface Window {
    authFetch: (url: string, options?: RequestInit) => Promise<Response>;
    editCategory: (id: string) => void;
    deleteCategory: (id: string) => Promise<void>;
    editHero: (id: string) => void;
    deleteHero: (id: string) => Promise<void>;
    editSku: (id: string) => void;
    deleteSku: (id: string) => Promise<void>;
    editBlog: (id: string) => void;
    deleteBlog: (id: string) => Promise<void>;
  }
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
      } | null;
      isAdmin: boolean;
    }
  }
}

// Shared type definitions for admin pages
interface CategoryData {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  description: string | null;
  sortOrder: number;
  active: number;
}

interface HeroData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: number;
  sortOrder: number;
}

interface SkuData {
  id: number;
  title: string;
  productType: string;
  price: number | null;
  businessPageId: number;
  active: number;
}

interface BlogData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: number;
  createdAt: string;
}

export {};


interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  active: number;
  createdAt: string;
}

interface ReviewData {
  id: number;
  userId: number;
  businessPageId: number;
  rating: number;
  comment: string;
  active: number;
  createdAt: string;
}

interface SubscriptionData {
  id: number;
  userId: number;
  planType: string;
  status: string;
  amount: number;
  createdAt: string;
}

interface PlanData {
  id: string;
  name: string;
  period: string;
  amount: number;
  skuLimit: number;
  maxImages: number;
  active: number;
}

interface MediaData {
  id: number;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: number;
  createdAt: string;
}

interface AgentResponse {
  action: string;
  data: Record<string, unknown>;
}


// Business edit page types
interface BusinessFormData {
  id: number;
  title: string;
  slug: string;
  entityType: string;
  categoryId: number;
  contactName: string;
  contactNumber: string;
  email: string;
  address: string;
  aboutUs: string;
  bannerImageId: string | null;
  latitude: number | null;
  longitude: number | null;
}

// Leaflet types (for map integration)
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void;
  on: (event: string, handler: (e: LeafletEvent) => void) => void;
  remove: () => void;
}

interface LeafletMarker {
  setLatLng: (latlng: [number, number]) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
}

interface LeafletEvent {
  latlng: { lat: number; lng: number };
}

interface LeafletStatic {
  map: (id: string) => LeafletMap;
  marker: (latlng: [number, number]) => LeafletMarker;
  tileLayer: (url: string, options: object) => object;
}

declare global {
  interface Window {
    L: LeafletStatic;
    loadGalleryPreview: (ids: string[]) => void;
    __pendingCategoryId: number;
  }
}


interface OrderData {
  id: number;
  userId: number;
  planType: string;
  amount: number;
  createdAt: string;
  status: string;
}