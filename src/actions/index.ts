// Astro Server Actions - Central Export
import * as admin from './admin';
import * as auth from './auth';
import * as business from './business';
import * as products from './products';
import * as media from './media';
import * as reviews from './reviews';
import * as banners from './banners';

// Re-export everything
export const actions = {
  admin,
  auth,
  business,
  products,
  media,
  reviews,
  banners,
};

// Named export for Astro actions entry point
export const server = actions;