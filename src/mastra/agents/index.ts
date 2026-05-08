// AI Agents - Mastra Agents with structuredOutput + streaming + fallback
import { Agent } from "@mastra/core/agent";
import * as z from 'zod';
import {
  ListingDataSchema,
  SkuDataSchema,
  BlogDataSchema,
  LandingDataSchema,
  LISTING_INSTRUCTIONS,
  SKU_INSTRUCTIONS,
  BLOG_INSTRUCTIONS,
  LANDING_INSTRUCTIONS,
} from '@/lib/ai/validation';
import { minimaxProvider, workersAIProvider } from '@/lib/ai/providers';

// Model fallback configuration - MiniMax primary, Workers AI fallback
const createModelWithFallback = () => {
  return [
    { model: minimaxProvider, maxRetries: 2 },
    {
      model: {
        providerId: 'workers-ai',
        modelId: '@cf/meta/llama-3-8b-instruct',
      },
      maxRetries: 1,
      enabled: true,
    },
  ];
};

// ============================================
// Listing Creator Agent
// ============================================
export const listingCreator = new Agent({
  id: "listing-creator",
  name: "Listing Creator",
  instructions: LISTING_INSTRUCTIONS,
  model: createModelWithFallback() as any,
  structuredOutput: {
    schema: ListingDataSchema,
  },
});

// ============================================
// SKU Creator Agent
// ============================================
export const skuCreator = new Agent({
  id: "sku-creator",
  name: "SKU Creator",
  instructions: SKU_INSTRUCTIONS,
  model: createModelWithFallback() as any,
  structuredOutput: {
    schema: SkuDataSchema,
  },
});

// ============================================
// Blog Creator Agent
// ============================================
export const blogCreator = new Agent({
  id: "blog-creator",
  name: "Blog Creator",
  instructions: BLOG_INSTRUCTIONS,
  model: createModelWithFallback() as any,
  structuredOutput: {
    schema: BlogDataSchema,
  },
});

// ============================================
// Landing Page Creator Agent
// ============================================
export const landingPageCreator = new Agent({
  id: "landing-page-creator",
  name: "Landing Page Creator",
  instructions: LANDING_INSTRUCTIONS,
  model: createModelWithFallback() as any,
  structuredOutput: {
    schema: LandingDataSchema,
  },
});

export const agents = {
  listingCreator,
  skuCreator,
  blogCreator,
  landingPageCreator,
};