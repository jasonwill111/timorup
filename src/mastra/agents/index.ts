// AI Agents - Mastra Agents with MiniMax M2.7 and Structured Output
import { Agent } from "@mastra/core/agent";
import { getMinimaxApiKey } from '@/lib/env';
import {
  LISTING_INSTRUCTIONS,
  SKU_INSTRUCTIONS,
  BLOG_INSTRUCTIONS,
  LANDING_INSTRUCTIONS,
  ListingDataSchema,
  SkuDataSchema,
  BlogDataSchema,
  LandingDataSchema,
} from '@/lib/ai/validation';

// NOTE: In Cloudflare Workers, process.env is NOT available by default.
// We MUST use the nodejs_compat_populate_process_env compatibility flag in wrangler.jsonc
// For local dev: Vite loads .env into import.meta.env

// API key - must be accessible at module load time
const minimaxApiKey = getMinimaxApiKey();

// Model config - type-safe without as any
const minimaxModel: Parameters<typeof Agent>[0]['model'] = {
  providerId: "minimax-cn-coding-plan",
  modelId: "MiniMax-M2.7",
  apiKey: minimaxApiKey || undefined,
};

// ============================================
// Listing Creator Agent
// ============================================
export const listingCreator = new Agent({
  id: "listing-creator",
  name: "Listing Creator",
  instructions: LISTING_INSTRUCTIONS,
  model: minimaxModel,
  output: ListingDataSchema,
});

// ============================================
// SKU Creator Agent
// ============================================
export const skuCreator = new Agent({
  id: "sku-creator",
  name: "SKU Creator",
  instructions: SKU_INSTRUCTIONS,
  model: minimaxModel,
  output: SkuDataSchema,
});

// ============================================
// Blog Creator Agent
// ============================================
export const blogCreator = new Agent({
  id: "blog-creator",
  name: "Blog Creator",
  instructions: BLOG_INSTRUCTIONS,
  model: minimaxModel,
  output: BlogDataSchema,
});

// ============================================
// Landing Page Creator Agent
// ============================================
export const landingPageCreator = new Agent({
  id: "landing-page-creator",
  name: "Landing Page Creator",
  instructions: LANDING_INSTRUCTIONS,
  model: minimaxModel,
  output: LandingDataSchema,
});

export const agents = {
  listingCreator,
  skuCreator,
  blogCreator,
  landingPageCreator,
};